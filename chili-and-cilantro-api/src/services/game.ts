import { ObjectId } from 'mongodb';
import { Document, Model, Schema, startSession } from 'mongoose';
import validator from 'validator';
import {
  constants,
  CardType,
  IUser, IGame, IChef,
  ModelName,
  GamePhase,
  TurnAction,
  IBid,
  ChefState,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { AllCardsPlacedError } from '../errors/allCardsPlaced';
import { AlreadyJoinedOtherError } from '../errors/alreadyJoinedOther';
import { GameFullError } from '../errors/gameFull';
import { GameInProgressError } from '../errors/gameInProgress';
import { GamePasswordMismatchError } from '../errors/gamePasswordMismatch';
import { IncorrectGamePhaseError } from '../errors/incorrectGamePhase';
import { InvalidActionError } from '../errors/invalidAction';
import { InvalidGameError } from '../errors/invalidGame';
import { InvalidGameNameError } from '../errors/invalidGameName';
import { InvalidGamePasswordError } from '../errors/invalidGamePassword';
import { InvalidGameParameterError } from '../errors/invalidGameParameter';
import { InvalidUserNameError } from '../errors/invalidUserName';
import { InvalidMessageError } from '../errors/invalidMessage';
import { NotEnoughChefsError } from '../errors/notEnoughChefs';
import { NotHostError } from '../errors/notHost';
import { OutOfIngredientError } from '../errors/outOfIngredient';
import { OutOfOrderError } from '../errors/outOfOrder';
import { UsernameInUseError } from '../errors/usernameInUse';
import { IDatabase } from '../interfaces/database';
import { ActionService } from './action';
import { ChefService } from './chef';
import { PlayerService } from './player';
import { UtilityService } from './utility';
import { TransactionManager } from './transactionManager';

export class GameService extends TransactionManager {
  private readonly GameModel: Model<IGame>;
  private readonly actionService: ActionService;
  private readonly chefService: ChefService;
  private readonly playerService: PlayerService;

  constructor(gameModel: Model<IGame>, actionService: ActionService, chefService: ChefService, playerService: PlayerService) {
    super();
    this.GameModel = gameModel;
    this.actionService = actionService;
    this.chefService = chefService;
    this.playerService = playerService;
  }

  /**
   * Generates a new game code that is not being used by an active game
   * Should be called within a transaction
   * @returns string game code
   */
  public async generateNewGameCodeAsync(): Promise<string> {
    // find a game code that is not being used by an active game
    // codes are freed up when currentPhase is GAME_OVER
    let code = '';
    let gameCount = 0;
    const totalAttempts = 1000;
    let attemptsRemaining = totalAttempts;
    while (attemptsRemaining-- > 0) {
      code = UtilityService.generateGameCode();
      // check if there is an active game with the given game code
      gameCount = await this.GameModel.countDocuments({ code, currentPhase: { $ne: GamePhase.GAME_OVER } });
      if (gameCount === 0) {
        // If no active game has the code, it can be used for a new game
        return code;
      }
    }
    throw new Error(`Unable to generate a unique game code in ${totalAttempts} attempts.`);
  }

  /**
   * Validates the parameters before creating a game or throws a validation error
   * @param user The user creating the game
   * @param userName The display name for the user
   * @param gameName The name of the game
   * @param password Optional password for the game. Empty string for no password.
   * @param maxChefs The maximum number of chefs in the game. Must be between MIN_CHEFS and MAX_CHEFS.
   */
  public async validateCreateGameOrThrowAsync(user: IUser & Document, userName: string, gameName: string, password: string, maxChefs: number): Promise<void> {
    if (await this.playerService.userIsInAnyActiveGameAsync(user)) {
      throw new AlreadyJoinedOtherError();
    }
    if (!validator.matches(userName, constants.MULTILINGUAL_STRING_REGEX) || userName.length < constants.MIN_USER_NAME_LENGTH || userName.length > constants.MAX_USER_NAME_LENGTH) {
      throw new InvalidUserNameError();
    }
    if (!validator.matches(gameName, constants.MULTILINGUAL_STRING_REGEX) || gameName.length < constants.MIN_GAME_NAME_LENGTH || gameName.length > constants.MAX_GAME_NAME_LENGTH) {
      throw new InvalidGameNameError();
    }
    if (password.length > 0 && (password.length < constants.MIN_GAME_PASSWORD_LENGTH || password.length > constants.MAX_GAME_PASSWORD_LENGTH)) {
      throw new InvalidGamePasswordError();
    }
    if (maxChefs < constants.MIN_CHEFS || maxChefs > constants.MAX_CHEFS) {
      throw new InvalidGameParameterError(`Must be between ${constants.MIN_CHEFS} and ${constants.MAX_CHEFS}.`, 'maxChefs');
    }
  }

  /**
   * Creates a new game with the specified parameters
   * @param user The user creating the game
   * @param userName The display name for the user
   * @param gameName The name of the game
   * @param password Optional password for the game. Empty string for no password.
   * @param maxChefs The maximum number of chefs in the game. Must be between MIN_CHEFS and MAX_CHEFS.
   * @returns 
   */
  public async createGameAsync(user: IUser & Document, userName: string, gameName: string, password: string, maxChefs: number): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    const gameId = new ObjectId();
    const chefId = new ObjectId();
    const gameCode = await this.generateNewGameCodeAsync();
    const game = await this.GameModel.create({
      _id: gameId,
      cardsPlaced: 0,
      chefIds: [chefId],
      code: gameCode,
      currentBid: -1,
      currentChef: -1,
      currentPhase: GamePhase.LOBBY,
      currentRound: -1,
      hostChefId: chefId,
      hostUserId: user._id,
      maxChefs: maxChefs,
      name: gameName,
      ...password ? { password: password } : {},
      roundBids: [],
      roundWinners: [],
      turnOrder: [], // will be chosen when the game is about to start
    });
    const chef = await this.chefService.newChefAsync(game, user, userName, true, chefId);
    await this.actionService.createGameAsync(game, chef, user);
    return { game, chef };
  }

  /**
   * Creates a new game with the specified parameters
   * @param user The user creating the game
   * @param userName The display name for the user
   * @param gameName The name of the game
   * @param password Optional password for the game. Empty string for no password.
   * @param maxChefs The maximum number of chefs in the game. Must be between MIN_CHEFS and MAX_CHEFS.
   * @returns 
   */
  public async performCreateGameAsync(user: IUser & Document, userName: string, gameName: string, password: string, maxChefs: number): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    return this.withTransaction(async (session) => {
      await this.validateCreateGameOrThrowAsync(user, userName, gameName, password, maxChefs);
      return this.createGameAsync(user, userName, gameName, password, maxChefs);
    });
  }

  /**
   * Joins the player to the specified game and creates a chef object for them
   * @param gameCode 
   * @param password 
   * @param user 
   * @param userName 
   * @returns 
   */
  public async joinGameAsync(game: IGame & Document, user: IUser & Document, userName: string): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    const chef = await this.chefService.newChefAsync(game, user, userName, false);
    await this.actionService.joinGameAsync(game, chef, user);
    game.chefIds.push(chef._id);
    await game.save();
    return { game, chef };
  }

  public async validateJoinGameOrThrow(game: IGame & Document, user: IUser & Document, userName: string, password: string): Promise<void> {
    const chefNames = await this.getGameChefNamesAsync(game._id);
    if (chefNames.includes(userName)) {
      throw new UsernameInUseError();
    }
    if (await this.playerService.userIsInAnyActiveGameAsync(user)) {
      throw new AlreadyJoinedOtherError();
    }
    if (game.password && game.password !== password) {
      throw new GamePasswordMismatchError();
    }
    if (game.currentPhase !== GamePhase.LOBBY) {
      throw new GameInProgressError();
    }
    if (game.chefIds.length > game.maxChefs) {
      throw new GameFullError();
    }
    if (!validator.matches(userName, constants.MULTILINGUAL_STRING_REGEX) || userName.length < constants.MIN_USER_NAME_LENGTH || userName.length > constants.MAX_USER_NAME_LENGTH) {
      throw new InvalidUserNameError();
    }
  }

  /**
   * Joins the player to the specified game and creates a chef object for them
   * @param gameCode 
   * @param password 
   * @param user 
   * @param userName 
   * @returns 
   */
  public async performJoinGameAsync(gameCode: string, password: string, user: IUser & Document, userName: string): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    return this.withTransaction(async (session) => {
      const game = await this.getGameByCodeOrThrowAsync(gameCode, true);
      await this.validateJoinGameOrThrow(game, user, userName, password);
      return this.joinGameAsync(game, user, userName);
    });
  }

  public async createNewGameFromExistingAsync(
    existingGame: IGame & Document,
    user: IUser,
  ): Promise<{ game: IGame & Document, chef: IChef & Document }> {

    const newChefIds = existingGame.chefIds.map(() => new ObjectId());

    // find the existing chef id's index
    const hostChefIndex = existingGame.chefIds.findIndex(chefId => existingGame.hostChefId.toString() == chefId.toString());
    const newHostChefId = newChefIds[hostChefIndex];

    // we need to look up the user id for all chefs in the current game
    const existingChefs = await this.chefService.getGameChefsByGameAsync(existingGame);

    // Create the new Game document without persisting to the database yet
    const newGame = new this.GameModel({
      chefIds: newChefIds,
      code: existingGame.code,
      cardsPlaced: 0,
      currentBid: -1,
      currentChef: -1,
      currentRound: -1,
      currentPhase: GamePhase.LOBBY,
      hostChefId: newChefIds[hostChefIndex],
      hostUserId: existingGame.hostUserId,
      lastGame: existingGame._id,
      maxChefs: existingGame.maxChefs,
      name: existingGame.name,
      ...existingGame.password ? { password: existingGame.password } : {},
      roundBids: [],
      roundWinners: [],
      turnOrder: [], // will be chosen when the game is started
    });

    // Create new Chef documents
    const chefCreations = newChefIds.map((newChefId, index) => {
      const existingChef = existingChefs.find(chef => chef._id.toString() == existingGame.chefIds[index].toString());
      return this.chefService.newChefFromExisting(game, existingChef, newChefId);
    });

    // Execute all creations concurrently
    const chefs = await Promise.all(chefCreations);

    // Persist the new game
    const game = await newGame.save();

    // Create action for game creation - this could be moved to an event or a method to encapsulate the logic
    const hostChef = chefs.find(chef => chef._id.toString() == newHostChefId.toString());
    await this.actionService.createGameAsync(existingGame, hostChef, user);
    return { game, chef: chefs[hostChefIndex] };
  }

  /**
   * Validates that a new game can be created from an existing game or throws a validation error
   * @param existingGame The existing game to create a new game from
   */
  public validateCreateNewGameFromExistingOrThrow(existingGame: IGame & Document): void {
    if (existingGame.currentPhase !== GamePhase.GAME_OVER) {
      throw new GameInProgressError();
    }
  }

  /**
   * Creates a new game from a completed game. The new game will have the same code, name, password, and players as the existing game.
   * @param existingGameId The ID of the existing game
   * @returns A tuple of the new game and chef objects
   */
  public async performCreateNewGameFromExistingAsync(
    existingGameId: string,
    user: IUser,
  ): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    return this.withTransaction(async (session) => {
      const existingGame = await this.getGameByIdOrThrowAsync(existingGameId, true);
      this.validateCreateNewGameFromExistingOrThrow(existingGame);
      return this.createNewGameFromExistingAsync(existingGame, user);
    });
  }

  /**
   * Starts the specified game
   * @param game The game to start
   * @returns A tuple of the game and the start game action
   */
  public async startGameAsync(game: IGame & Document): Promise<{ game: IGame & Document, action: Document<unknown> }> {
    // set the current bid to 0
    game.currentBid = 0;
    // set the current chef to the first player
    game.currentChef = 0;
    // set the game phase to SETUP
    game.currentPhase = GamePhase.SETUP;
    // set the current round to 0
    game.currentRound = 0;
    // create a random order of players
    // shuffle the chef ids
    game.turnOrder = UtilityService.shuffleArray(game.chefIds);
    // save the game
    const savedGame = await game.save();
    const startAction = await this.actionService.startGameAsync(savedGame);
    // mark all chefs as PLAYING
    const chefs = await this.chefService.getGameChefsByGameAsync(savedGame);
    chefs.forEach(chef => {
      chef.state = ChefState.PLAYING;
      chef.save();
    });
    return { game: savedGame, action: startAction };
  }

  /**
   * Validates that the specified game can be started or throws a validation error
   * @param game The game to start
   * @param userId The ID of the user starting the game
   */
  public async validateStartGameOrThrowAsync(game: IGame & Document, userId: string): Promise<void> {
    if (!await this.playerService.isGameHostAsync(userId, game._id)) {
      throw new NotHostError();
    }
    if (game.currentPhase !== GamePhase.LOBBY) {
      throw new GameInProgressError();
    }
    if (game.chefIds.length < constants.MIN_CHEFS) {
      throw new NotEnoughChefsError(game.chefIds.length, constants.MIN_CHEFS);
    }
  }

  /**
   * Starts the specified game
   * @param gameId 
   * @returns 
   */
  public async performStartGameAsync(gameCode: string, userId: string): Promise<{ game: IGame & Document, action: Document<unknown> }> {
    return this.withTransaction(async (session) => {
      const game = await this.getGameByCodeOrThrowAsync(gameCode, true);
      await this.validateStartGameOrThrowAsync(game, userId);
      return this.startGameAsync(game);
    });
  }

  /**
   * Gets a Game model by game ID
   * @param gameId 
   * @returns Game model
   */
  public async getGameByIdOrThrowAsync(gameId: string, active = false): Promise<IGame & Document> {
    const search = active ? { _id: new ObjectId(gameId), currentPhase: { $ne: GamePhase.GAME_OVER } } : { _id: new ObjectId(gameId) };
    const game = await this.GameModel.findOne(search);
    if (!game) {
      throw new InvalidGameError();
    }
    return game;
  }

  /**
   * Gets a Game model by game code
   * @param gameCode 
   * @returns Game model
   */
  public async getGameByCodeOrThrowAsync(gameCode: string, active = false): Promise<IGame & Document> {
    // find where not GAME_OVER
    const search = active ? { code: gameCode, currentPhase: { $ne: GamePhase.GAME_OVER } } : { code: gameCode };
    // Find the games with the given code, sort by updated timestamp in descending order, and get the first
    const game = await this.GameModel.find(search)
      .sort({ updatedAt: -1 }) // -1 for descending order
      .limit(1) // Limit to 1 to get only the most recent game
      .then(games => games[0]); // Extract the first element

    // If no game is found, throw an error
    if (!game) {
      throw new InvalidGameError();
    }
    return game;
  }

  /**
   * Expires the specified games
   * @param games A collection of games to expire
   */
  public async expireGamesOrThrowAsync(games: (Document<unknown, {}, IGame> & IGame & Required<{
    _id: Schema.Types.ObjectId;
  }>)[]): Promise<void> {
    // set currentPhase to GAME_OVER
    for (const game of games) {
      game.currentPhase = GamePhase.GAME_OVER;
      const savedGame = await game.save();
      // TODO: close any sockets for this game
      await this.actionService.expireGameAsync(savedGame);
      // set all chefs to EXPIRED
      const chefs = await this.chefService.getGameChefsByGameAsync(savedGame);
      chefs.forEach(chef => {
        chef.state = ChefState.EXPIRED;
        chef.save();
      });
    }
  }

  /**
   * Finds games not in GAME_OVER phase with a lastModified date older than MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES and marks them GAME_OVER
   */
  public async performExpireOldGamesAsync(): Promise<void> {
    return this.withTransaction(async (session) => {
      // find games not in GAME_OVER phase with a lastModified date older than MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES
      // cutoffDate is now minus MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES
      const cutoffDate = new Date();
      cutoffDate.setMinutes(cutoffDate.getMinutes() - constants.MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES);
      const games = await this.GameModel.find({ currentPhase: { $ne: GamePhase.GAME_OVER }, lastModified: { $lt: cutoffDate } });
      this.expireGamesOrThrowAsync(games);
    });
  }

  /**
   * Validates that the specified chef can place a card or throws a validation error
   * @param message The message to validate
   */
  public validateSendMessageOrThrow(message: string): void {
    if (message.length < constants.MIN_MESSAGE_LENGTH || message.length > constants.MAX_MESSAGE_LENGTH) {
      throw new InvalidMessageError();
    }
  }

  /**
   * Sends a message to all players in the specified game
   * @param game The game to send the message to
   * @param chef The chef sending the message
   * @param message The message to send
   * @returns The message action object
   */
  public async sendMessageAsync(game: IGame, chef: IChef, message: string): Promise<Document<unknown>> {
    return this.actionService.sendMessageAsync(game, chef, message);
  }

  /**
   * Sends a message to all players in the specified game
   * @param gameCode The game code of an active game
   * @param user The user sending the message
   * @param message The message to send
   * @returns The message action object
   */
  public async performSendMessageAsync(gameCode: string, user: IUser & Document, message: string): Promise<Document<unknown>> {
    return this.withTransaction(async (session) => {
      const game = await this.getGameByCodeOrThrowAsync(gameCode, true);
      const chef = await this.chefService.getGameChefOrThrowAsync(game, user);
      this.validateSendMessageOrThrow(message);
      return this.sendMessageAsync(game, chef, message);
    });
  }

  /**
   * Gets all chef names for the specified game
   * @param gameId 
   * @returns Array of chef names
   */
  public async getGameChefNamesAsync(gameId: string): Promise<string[]> {
    const chefs = await this.chefService.getGameChefsByGameIdAsync(gameId);
    return chefs.map(chef => chef.name);
  }

  /**
   * Return whether the current chef can bid
   * @param gameCode 
   * @param user 
   */
  public canBid(game: IGame, chef: IChef): boolean {
    // current phase must be SETUP or BIDDING
    if (game.currentPhase !== GamePhase.BIDDING && game.currentPhase !== GamePhase.SETUP) {
      return false;
    }
    // the current chef must be the user
    if (game.turnOrder[game.currentChef].toString() !== chef._id.toString()) {
      return false;
    }
    // there must not be no cards placed yet
    if (game.cardsPlaced == 0) {
      return false;
    }
    // the minimum bid is game.currentBid + 1
    const minimumBid = game.currentBid + 1;
    // we must be able to bid at least one card, but no more than the number of cards placed
    if (minimumBid > game.cardsPlaced) {
      return false;
    }
    return true;
  }

  /**
   * Return whether the given chef can place a card
   * @param game 
   * @param chef 
   * @returns 
   */
  public canPlaceCard(game: IGame, chef: IChef): boolean {
    // current phase must be SETUP
    if (game.currentPhase !== GamePhase.SETUP) {
      return false;
    }
    // the current chef must be the user
    if (game.turnOrder[game.currentChef].toString() !== chef._id.toString()) {
      return false;
    }
    // the chef must have cards left in their hand
    if (chef.hand.length == 0) {
      return false;
    }
    return true;
  }

  /**
   * Return whether the given chef can pass on bidding or increasing the bid.
   * @param game 
   * @param chef 
   */
  public canPass(game: IGame, chef: IChef): boolean {
    // the current chef must be the user
    if (game.turnOrder[game.currentChef].toString() !== chef._id.toString()) {
      return false;
    }
    // current phase must be BIDDING
    // the current phase being bidding eliminates the possibility of passing during the placing cards phase
    if (game.currentPhase !== GamePhase.BIDDING) {
      return false;
    }
    // if no one has bid yet, the the chef must make a bid
    if (game.currentBid <= 0) {
      return false;
    }
    /* if the previous chef bid the maximum number of cards, they automatically must reveal cards
     * and bidding should not have moved to the next player
     * the game phase should have moved to REVEAL
     * therefore, the current chef cannot pass
     */
    if (game.currentBid == game.cardsPlaced) {
      return false;
    }
    /* Whenever the bid is increased, all other players have the opportunity to increase it further or pass
       unless the bid is the maximum and we immediately move to the next phase.
       If the second player in the turn order increases the bid, we must go through the remainder of the players
       in the turn order and back through the first before moving to REVEAL phase.
    */
    if (this.haveAllRemainingPlayersPassed(game)) {
      return false;
    }
    return true;
  }

  /**
   * Returns the available actions to the current chef
   * This will return an empty array if the chef passed in is not the current chef
   * @param game 
   * @param chef 
   * @returns An array of available actions
   */
  public availableTurnActions(game: IGame, chef: IChef): TurnAction[] {
    const actions: TurnAction[] = [];
    if (this.canPlaceCard(game, chef)) {
      actions.push(TurnAction.PlaceCard);
    }
    if (this.canPass(game, chef)) {
      actions.push(TurnAction.Pass);
    }
    const canBid = this.canBid(game, chef);
    const existingBid = game.currentBid <= 0;
    // if there has been at least one bid, users can increase the bid
    if (canBid && existingBid) {
      actions.push(TurnAction.IncreaseBid);
      // otherwise they can make a bid
    } else if (canBid) {
      actions.push(TurnAction.Bid);
    }
    return actions;
  }

  /**
   * Validates that the specified chef can place a card or throws a validation error
   * @param game The game to validate
   * @param chef The chef to validate
   * @param ingredient The ingredient to place
   */
  public validatePlaceIngredientOrThrow(game: IGame & Document, chef: IChef & Document, ingredient: CardType): void {
    if (game.currentPhase !== GamePhase.SETUP) {
      throw new IncorrectGamePhaseError();
    }
    if (game.turnOrder[game.currentChef].toString() !== chef._id.toString()) {
      throw new OutOfOrderError();
    }
    if (chef.placedCards.length >= constants.MAX_HAND_SIZE || chef.hand.length == 0) {
      throw new AllCardsPlacedError();
    }
    // can the chef place a card in general
    if (!this.canPlaceCard(game, chef)) {
      throw new InvalidActionError(TurnAction.PlaceCard);
    }
    // can they specifically place the given card
    if (chef.hand.filter(card => card.type == ingredient).length == 0) {
      throw new OutOfIngredientError(ingredient);
    }
  }

  /**
   * Places a card for the specified chef
   * @param game The game to place the card in
   * @param chef The chef placing the card
   * @param ingredient The ingredient to place
   * @returns A tuple of the updated game and chef objects
   */
  public async placeIngredientAsync(game: IGame & Document, chef: IChef & Document, ingredient: CardType): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    // remove one card of the specified type from the chef's hand
    chef.hand.splice(chef.hand.findIndex(card => card.type == ingredient), 1);
    // add the card to the chef's placed cards
    chef.placedCards.push({ type: ingredient, faceUp: false });
    const savedChef = await chef.save();
    // increment the current chef
    game.currentChef = (game.currentChef + 1) % game.chefIds.length;
    // after placing a card we will have to perform some checks on what has to happen next
    // there may be no more cards to place and we may need to move to bidding, etc
    // this will happen in performTurnActionAsync()
    const savedGame = await game.save();
    return { game: savedGame, chef: savedChef };
  }

  /**
   * When the game is in setup phase, the current player can place a card or make a bid. This method places a card.
   * @param gameCode 
   * @param user 
   * @param ingredient 
   * @returns A tuple of the updated game and chef objects
   */
  public async performPlaceIngredientAsync(game: IGame & Document, chef: IChef & Document, ingredient: CardType): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    this.validatePlaceIngredientOrThrow(game, chef, ingredient);
    return this.placeIngredientAsync(game, chef, ingredient);
  }

  /**
   * Validates that the specified chef can increase the bid or throws a validation error
   * @param game The game to validate
   * @param chef The chef to validate
   * @param bid The bid to place
   */
  public validateMakeBidOrThrow(game: IGame & Document, chef: IChef & Document, bid: number): void {
    if (!this.canBid(game, chef)) {
      throw new InvalidActionError(TurnAction.Bid);
    }
    if (bid < game.currentBid + 1 || bid > game.cardsPlaced) {
      throw new InvalidActionError(TurnAction.Bid, bid);
    }
  }

  /**
   * Makes a bid for the specified chef
   * @param game The game to bid in
   * @param chef The chef making the bid
   * @param bid The bid to make
   * @returns A tuple of the updated game and chef objects
   */
  public async makeBidAsync(game: IGame & Document, chef: IChef & Document, bid: number): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    const firstBid = game.currentBid <= 0;
    // set the current bid
    game.currentBid = bid;
    // increment the current chef
    game.currentChef = (game.currentChef + 1) % game.chefIds.length;
    // just set the current phase to bidding, even if we might have to change phases after the bid
    // eg because the bid was the same as the number of cards placed and no one else can bid
    // after each turn action, we will have to perform some checks on what has to happen next
    if (game.currentPhase == GamePhase.SETUP && firstBid) {
      game.currentPhase = GamePhase.BIDDING;
    }
    // create a new round bid
    const roundBid: IBid = {
      chefId: chef._id,
      bid: bid,
      pass: false,
    };
    if (game.roundBids[game.currentRound] === undefined) {
      game.roundBids[game.currentRound] = [];
    }
    game.roundBids[game.currentRound].push(roundBid);
    if (firstBid) {
      await this.actionService.startBiddingAsync(game, chef, bid);
    }
    const savedGame = await game.save();
    return { game: savedGame, chef };
  }

  /**
   * Rather than placing a card, the current player can make a bid. This method makes a bid.
   * The game phase will move from SETUP to BIDDING
   * @param gameCode 
   * @param user 
   * @param bid 
   */
  public async performMakeBidAsync(game: IGame & Document, chef: IChef & Document, bid: number): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    this.validateMakeBidOrThrow(game, chef, bid);
    return this.makeBidAsync(game, chef, bid);
  }

  /**
   * Determines whether all remaining players have passed since the last non-passing bid
   * @param game The game to check
   * @returns True if all remaining players have passed since the last non-passing bid, false otherwise
   */
  public haveAllRemainingPlayersPassed(game: IGame): boolean {
    // Get the bids for the current round
    const currentRoundBids = game.roundBids[game.currentRound];

    // If there are no bids in the current round, we return false because we can't have passes without bids
    if (!currentRoundBids || currentRoundBids.length === 0) {
      return false;
    }

    // Find the most recent non-passing bid in the current round
    const lastNonPassingBid = currentRoundBids.slice().reverse().find(bid => !bid.pass);

    // If no such bid exists, then return false since we need at least one non-passing bid
    if (!lastNonPassingBid) {
      return false;
    }

    // Get the index of the last non-passing bid
    const lastNonPassingBidIndex = currentRoundBids.findIndex(bid => bid.chefId.toString() === lastNonPassingBid.chefId.toString());

    // Create a list of chefIds who have made a bid since the last non-passing bid (including the chef who made it)
    const subsequentChefIds = currentRoundBids.slice(lastNonPassingBidIndex).map(bid => bid.chefId.toString());

    // Find all unique chefIds who have passed since the last non-passing bid (excluding the chef who made the bid)
    const uniquePassingChefIds = [...new Set(subsequentChefIds.filter((chefId, index) => {
      return currentRoundBids[lastNonPassingBidIndex + index].pass && chefId !== lastNonPassingBid.chefId.toString();
    }))];

    // Determine if all other chefs have passed since the last non-passing bid
    const allOtherChefsHavePassed = game.chefIds.every(chefId => {
      // The chef who made the last non-passing bid is not expected to have passed
      return chefId.toString() === lastNonPassingBid.chefId.toString() || uniquePassingChefIds.includes(chefId.toString());
    });

    return allOtherChefsHavePassed;
  }

  /**
   * Validates that the specified chef can pass on bidding or throws a validation error
   * @param game The game to validate
   * @param chef The chef to validate
   */
  public validatePerformPassOrThrow(game: IGame & Document, chef: IChef & Document): void {
    if (!this.canPass(game, chef)) {
      throw new InvalidActionError(TurnAction.Pass);
    }
  }

  /**
   * Passes on increasing the bid
   * @param game The game to pass in
   * @param chef The chef passing
   * @returns A tuple of the updated game and chef objects
   */
  public async passAsync(game: IGame & Document, chef: IChef & Document): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    // create pass event/action
    await this.actionService.passAsync(game, chef);
    // increment the current chef
    game.currentChef = (game.currentChef + 1) % game.chefIds.length;
    // create a new round bid history
    const roundBid: IBid = {
      chefId: chef._id,
      bid: game.currentBid,
      pass: true,
    };
    if (game.roundBids[game.currentRound] === undefined) {
      throw new Error('Cannot pass before the first bid');
    }
    game.roundBids[game.currentRound].push(roundBid);
    const savedGame = await game.save();
    return { game: savedGame, chef };
  }

  /**
   * A chef passes on increasing the bid
   * @param game The game to pass in
   * @param chef The chef passing
   */
  public async performPassAsync(game: IGame & Document, chef: IChef & Document): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    this.validatePerformPassOrThrow(game, chef);
    return this.passAsync(game, chef);
  }

  /**
   * A user performs a turn action
   * @param gameCode 
   * @param user 
   * @param action 
   * @param value 
   * @returns 
   */
  public async performTurnActionAsync(gameCode: string, user: IUser & Document, action: TurnAction, value?: { bid?: number, ingredient?: CardType }): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    return this.withTransaction(async (session) => {
      const game = await this.getGameByCodeOrThrowAsync(gameCode, true);
      if (game.chefIds[game.currentChef].toString() !== user._id.toString()) {
        throw new OutOfOrderError();
      }
      const chef = await this.chefService.getGameChefOrThrowAsync(game, user);
      // BID, INCREASE_BID, PASS, or PLACE_CARD
      const availableActions = this.availableTurnActions(game, chef);
      if (!availableActions.includes(action)) {
        throw new InvalidActionError(action, value?.bid, value?.ingredient);
      }
      let result: { game: IGame & Document, chef: IChef & Document } = undefined;
      switch (action) {
        case TurnAction.Bid:
        case TurnAction.IncreaseBid:
          if (!value.bid) {
            throw new InvalidActionError(action);
          }
          result = await this.performMakeBidAsync(game, chef, value.bid);
          break;
        case TurnAction.PlaceCard:
          if (!value.ingredient) {
            throw new InvalidActionError(action);
          }
          result = await this.performPlaceIngredientAsync(game, chef, value.ingredient);
          break;
        case TurnAction.Pass:
          result = await this.performPassAsync(game, chef);
          break;
        default:
          throw new InvalidActionError(action);
      }
      // TODO determine next state, transition current phase, etc
      return result;
    });
  }
}