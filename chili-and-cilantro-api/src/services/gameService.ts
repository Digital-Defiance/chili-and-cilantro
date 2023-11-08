import { ObjectId } from 'mongodb';
import { Document, Model, startSession } from 'mongoose';
import validator from 'validator';
import {
  constants,
  Action,
  IUser, IGame, IChef,
  ModelName,
  ChefState,
  GamePhase,
  ICreateGameAction,
  ICreateGameDetails,
  IExpireGameAction,
  IExpireGameDetails,
  IJoinGameAction,
  IJoinGameDetails,
  IStartGameAction,
  IStartGameDetails,
  ModelData,
  IMessageAction,
  IMessageDetails,
  IAction,
  TurnAction,
  IBid,
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
import { NotInGameError } from '../errors/notInGame';
import { OutOfIngredientError } from '../errors/outOfIngredient';
import { OutOfOrderError } from '../errors/outOfOrder';
import { UsernameInUseError } from '../errors/usernameInUse';
import { IDatabase } from '../interfaces/database';
import { CardType } from 'chili-and-cilantro-lib/src/lib/enumerations/cardType';
import { ICard } from 'chili-and-cilantro-lib/src/lib/interfaces/card';
import { PlayerService } from './playerService';
import { UtilityService } from './utilityService';

export class GameService {
  private readonly Database: IDatabase;
  private readonly ActionModel: Model<IAction>;
  private readonly ChefModel: Model<IChef>;
  private readonly GameModel: Model<IGame>;
  private readonly playerService: PlayerService;

  constructor(database: IDatabase, playerService: PlayerService) {
    this.Database = database;
    this.ActionModel = database.getModel<IAction>(ModelName.Action);
    this.ChefModel = database.getModel<IChef>(ModelName.Chef);
    this.GameModel = database.getModel<IGame>(ModelName.Game);
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
    let attempts = 1000;
    while (attempts-- > 0) {
      code = UtilityService.generateGameCode();
      // check if there is an active game with the given game code
      gameCount = await this.GameModel.countDocuments({ code, currentPhase: { $ne: GamePhase.GAME_OVER } });
      if (gameCount === 0) {
        // If no active game has the code, it can be used for a new game
        return code;
      }
    }
    throw new Error(`Unable to generate a unique game code in ${1000 - attempts} attempts.`);
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
  public async createGameAsync(user: IUser, userName: string, gameName: string, password: string, maxChefs: number): Promise<{ game: IGame & Document, chef: IChef & Document }> {
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
    const session = await startSession();
    try {
      session.startTransaction();
      const gameId = new ObjectId();
      const chefId = new ObjectId();
      const gameCode = await this.generateNewGameCodeAsync();
      const game = await this.GameModel.create({
        _id: gameId,
        cardsPlaced: 0,
        chefIds: [chefId],
        code: gameCode,
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
      const chef = await this.ChefModel.create({
        _id: chefId,
        gameId: gameId,
        name: userName,
        userId: user._id,
        hand: [],
        state: ChefState.LOBBY,
        host: true,
      });
      await this.Database.getActionModel(Action.CREATE_GAME).create({
        gameId: game._id,
        chefId: chef._id,
        userId: user._id,
        type: Action.CREATE_GAME,
        details: {} as ICreateGameDetails,
        round: -1,
      } as ICreateGameAction);
      await session.commitTransaction();
      return { game, chef };
    }
    catch (e) {
      await session.abortTransaction();
      throw e;
    }
    finally {
      session.endSession();
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
  public async joinGameAsync(gameCode: string, password: string, user: IUser, userName: string): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    if (await this.playerService.userIsInAnyActiveGameAsync(user)) {
      throw new AlreadyJoinedOtherError();
    }
    const game = await this.getGameByCodeAsync(gameCode, true);
    if (!game) {
      throw new InvalidGameError();
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
    const session = await startSession();
    try {
      session.startTransaction();
      const chefNames = await this.getGameChefNamesAsync(game._id);
      if (chefNames.includes(userName)) {
        throw new UsernameInUseError();
      }
      const chef = await this.ChefModel.create({
        gameId: game._id,
        userId: user._id,
        name: userName,
        hand: UtilityService.makeHand(),
        placedCards: [],
        state: ChefState.LOBBY,
        host: false,
      });
      await this.Database.getActionModel(Action.JOIN_GAME).create({
        gameId: game._id,
        chefId: chef._id,
        userId: user._id,
        type: Action.JOIN_GAME,
        details: {} as IJoinGameDetails,
        round: -1,
      } as IJoinGameAction)
      game.chefIds.push(chef._id);
      await game.save();
      await session.commitTransaction();
      return { game, chef };
    } catch (e) {
      await session.abortTransaction();
      throw e;
    }
    finally {
      session.endSession();
    }
  }

  /**
   * Creates a new game from a completed game. The new game will have the same code, name, password, and players as the existing game.
   * @param existingGameId The ID of the existing game
   * @returns A tuple of the new game and chef objects
   */
  public async createNewGameFromExistingAsync(
    existingGameId: string,
  ): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    const existingGame = await this.GameModel.findById(existingGameId);
    if (!existingGame) {
      throw new InvalidGameError();
    }
    if (existingGame.currentPhase !== GamePhase.GAME_OVER) {
      throw new GameInProgressError();
    }

    const session = await startSession();
    try {
      session.startTransaction();
      const newChefIds = existingGame.chefIds.map(() => new ObjectId());

      // find the existing chef id's index
      const hostChefIndex = existingGame.chefIds.findIndex(chefId => existingGame.hostChefId.toString() == chefId.toString());
      const newHostChefId = newChefIds[hostChefIndex];

      // we need to look up the user id for all chefs in the current game
      const existingChefs = await this.ChefModel.find({ gameId: existingGame._id });

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
        return this.ChefModel.create({
          _id: newChefId,
          gameId: newGame._id,
          name: existingChef.name,
          userId: existingChef.userId,
          hand: [{ type: CardType.CHILI, faceUp: false }, { type: CardType.CILANTRO, faceUp: false }, { type: CardType.CILANTRO, faceUp: false }, { type: CardType.CILANTRO, faceUp: false }],
          placedCards: [],
          state: ChefState.LOBBY,
          host: newChefId == newHostChefId,
        });
      });

      // Execute all creations concurrently
      const chefs = await Promise.all(chefCreations);

      // Persist the new game
      const game = await newGame.save();

      // Create action for game creation - this could be moved to an event or a method to encapsulate the logic
      await this.Database.getActionModel(Action.CREATE_GAME).create({
        gameId: existingGame._id,
        chefId: newGame.chefIds[hostChefIndex],
        userId: existingGame.hostUserId,
        type: Action.CREATE_GAME,
        details: {} as ICreateGameDetails,
      } as ICreateGameAction);

      await session.commitTransaction();
      return { game, chef: chefs[hostChefIndex] };
    }
    catch (e) {
      await session.abortTransaction();
      throw e;
    }
    finally {
      session.endSession();
    }
  }

  /**
   * Starts the specified game
   * @param gameId 
   * @returns 
   */
  public async startGameAsync(gameCode: string, userId: string): Promise<{ game: IGame & Document, action: Document<unknown> }> {
    const session = await startSession();
    try {
      session.startTransaction();
      const game = await this.getGameByCodeAsync(gameCode, true);
      if (!game) {
        throw new InvalidGameError();
      }
      if (!await this.playerService.isGameHostAsync(userId, game._id)) {
        throw new NotHostError();
      }
      if (game.currentPhase !== GamePhase.LOBBY) {
        throw new GameInProgressError();
      }
      if (game.chefIds.length < constants.MIN_CHEFS) {
        throw new NotEnoughChefsError(game.chefIds.length, constants.MIN_CHEFS);
      }
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

      const savedGame = await game.save();
      const startAction = await this.Database.getActionModel(Action.START_GAME).create({
        gameId: game._id,
        chefId: game.hostChefId,
        userId: game.hostUserId,
        type: Action.START_GAME,
        details: {} as IStartGameDetails,
        round: game.currentRound,
      } as IStartGameAction);
      await session.commitTransaction();
      return { game: savedGame, action: startAction };
    }
    catch (e) {
      await session.abortTransaction();
      throw e;
    }
    finally {
      session.endSession();
    }
  }

  /**
   * Gets a Game model by game ID
   * @param gameId 
   * @returns Game model
   */
  public async getGameByIdAsync(gameId: string, active = false): Promise<IGame & Document> {
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
  public async getGameByCodeAsync(gameCode: string, active = false): Promise<IGame & Document> {
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
   * Finds games not in GAME_OVER phase with a lastModified date older than MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES and marks them GAME_OVER
   */
  public async expireOldGamesAsync(): Promise<void> {
    // find games not in GAME_OVER phase with a lastModified date older than MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES
    // cutoffDate is now minus MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES
    const session = await startSession();
    try {
      session.startTransaction();
      const cutoffDate = new Date();
      cutoffDate.setMinutes(cutoffDate.getMinutes() - constants.MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES);
      const games = await this.GameModel.find({ currentPhase: { $ne: GamePhase.GAME_OVER }, lastModified: { $lt: cutoffDate } });
      // set currentPhase to GAME_OVER
      for (const game of games) {
        game.currentPhase = GamePhase.GAME_OVER;
        await game.save();
        // TODO: close any sockets for this game
        this.Database.getActionModel(Action.EXPIRE_GAME).create({
          gameId: game._id,
          chefId: game.hostChefId,
          userId: game.hostUserId,
          type: Action.EXPIRE_GAME,
          details: {} as IExpireGameDetails,
          round: game.currentRound,
        } as IExpireGameAction);
      }
      await session.commitTransaction();
    }
    catch (e) {
      await session.abortTransaction();
      throw e;
    }
    finally {
      session.endSession();
    }
  }

  /**
   * Sends a message to all players in the specified game
   * @param gameCode The game code of an active game
   * @param user The user sending the message
   * @param message The message to send
   * @returns The message action object
   */
  public async sendMessageAsync(gameCode: string, user: IUser, message: string): Promise<Document<IMessageAction>> {
    const session = await startSession();
    try {
      session.startTransaction();
      const game = await this.getGameByCodeAsync(gameCode, true);
      if (!game) {
        throw new InvalidGameError();
      }
      const chef = await this.ChefModel.findOne({ gameId: game._id, userId: user._id });
      if (!chef) {
        throw new NotInGameError();
      }
      if (message.length < constants.MIN_MESSAGE_LENGTH || message.length > constants.MAX_MESSAGE_LENGTH) {
        throw new InvalidMessageError();
      }
      const actionMessage = await this.Database.getActionModel(Action.MESSAGE).create({
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: Action.MESSAGE,
        details: {
          message: message,
        } as IMessageDetails,
        round: game.currentRound,
      } as IMessageAction);
      return actionMessage as Document<IMessageAction>;
    }
    catch (e) {
      await session.abortTransaction();
      throw e;
    }
    finally {
      session.endSession();
    }
  }

  /**
   * Gets all chef names for the specified game
   * @param gameId 
   * @returns Array of chef names
   */
  public async getGameChefNamesAsync(gameId: string): Promise<string[]> {
    const chefs = await this.ChefModel.find({ gameId: new ObjectId(gameId) });
    return chefs.map(chef => chef.name);
  }

  /**
   * Gets all actions for the specified game
   * @param gameCode 
   * @returns Array of actions, sorted by createdAt timestamp in ascending order
   */
  public async getGameActionsAsync(gameCode: string): Promise<IAction[]> {
    const game = await this.getGameByCodeAsync(gameCode, true);
    const actions = await this.ActionModel.find({ gameId: game._id }).sort({ createdAt: 1 });
    return actions;
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
    return true;
  }

  /**
   * Returns the available actions to the current chef
   * This will return an empty array if the chef passed in is not the current chef
   * @param game 
   * @param chef 
   * @returns An array of available actions
   */
  public availableActions(game: IGame, chef: IChef): TurnAction[] {
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
   * When the game is in setup phase, the current player can place a card or make a bid. This method places a card.
   * @param gameCode 
   * @param user 
   * @param ingredient 
   * @returns A tuple of the updated game and chef objects
   */
  public async placeIngredientAsync(game: IGame & Document, chef: IChef & Document, ingredient: CardType): Promise<{ game: IGame & Document, chef: IChef & Document }> {
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
    // remove one card of the specified type from the chef's hand
    chef.hand.splice(chef.hand.findIndex(card => card.type == ingredient), 1);
    // add the card to the chef's placed cards
    chef.placedCards.push({ type: ingredient, faceUp: false });
    await chef.save();
    // increment the current chef
    game.currentChef = (game.currentChef + 1) % game.chefIds.length;
    // after placing a card we will have to perform some checks on what has to happen next
    // there may be no more cards to place and we may need to move to bidding, etc
    // this will happen in performTurnActionAsync()
    await game.save();
    return { game, chef };
  }

  /**
   * Rather than placing a card, the current player can make a bid. This method makes a bid.
   * The game phase will move from SETUP to BIDDING
   * @param gameCode 
   * @param user 
   * @param bid 
   */
  public async makeBidAsync(game: IGame & Document, chef: IChef & Document, bid: number): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    if (!this.canBid(game, chef)) {
      throw new InvalidActionError(TurnAction.Bid);
    }
    if (bid < game.currentBid + 1 || bid > game.cardsPlaced) {
      throw new InvalidActionError(TurnAction.Bid, bid);
    }
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
    };
    if (game.roundBids[game.currentRound] === undefined) {
      game.roundBids[game.currentRound] = [];
    }
    game.roundBids[game.currentRound].push(roundBid);
    if (firstBid) {
      await this.Database.getActionModel(Action.START_BIDDING).create({
        gameId: game._id,
        chefId: game.turnOrder[game.currentChef], // this is the new current chef after incrementing above
        userId: chef.userId,
        type: Action.START_BIDDING,
        details: {} as IStartGameDetails,
        round: game.currentRound,
      } as IStartGameAction);
    }
    await game.save();
    return { game, chef };
  }

  /**
   * A chef passes on increasing the bid
   * @param game 
   * @param chef 
   */
  public async passAsync(game: IGame & Document, chef: IChef & Document): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    throw new Error('Method not implemented.');
  }

  /**
   * A user performs a turn action
   * @param gameCode 
   * @param user 
   * @param action 
   * @param value 
   * @returns 
   */
  public async performTurnActionAsync(gameCode: string, user: IUser, action: TurnAction, value?: { bid?: number, ingredient?: CardType }): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    const session = await startSession();
    try {
      session.startTransaction();
      const game = await this.getGameByCodeAsync(gameCode, true);
      if (!game) {
        throw new InvalidGameError();
      }
      const chef = await this.ChefModel.findOne({ gameId: game._id, userId: user._id });
      if (!chef) {
        throw new NotInGameError();
      }
      // BID, INCREASE_BID, PASS, or PLACE_CARD
      const availableActions = this.availableActions(game, chef);
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
          result = await this.makeBidAsync(game, chef, value.bid);
          break;
        case TurnAction.PlaceCard:
          if (!value.ingredient) {
            throw new InvalidActionError(action);
          }
          result = await this.placeIngredientAsync(game, chef, value.ingredient);
          break;
        case TurnAction.Pass:
          result = await this.passAsync(game, chef);
          break;
        default:
          throw new InvalidActionError(action);
      }
      // TODO determine next state, transition current phase, etc
      await session.commitTransaction();
      return result;
    }
    catch (e) {
      await session.abortTransaction();
      throw e;
    }
    finally {
      session.endSession();
    }
  }
}