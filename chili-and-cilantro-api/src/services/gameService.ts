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
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { AllCardsPlacedError } from '../errors/allCardsPlaced';
import { AlreadyJoinedOtherError } from '../errors/alreadyJoinedOther';
import { GameFullError } from '../errors/gameFull';
import { GameInProgressError } from '../errors/gameInProgress';
import { GamePasswordMismatchError } from '../errors/gamePasswordMismatch';
import { IncorrectGamePhaseError } from '../errors/incorrectGamePhase';
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

export class GameService {
  private readonly Database: IDatabase;
  private readonly ActionModel: Model<IAction>;
  private readonly ChefModel: Model<IChef>;
  private readonly GameModel: Model<IGame>;

  constructor(database: IDatabase) {
    this.Database = database;
    this.ActionModel = database.getModel<IAction>(ModelName.Action);
    this.ChefModel = database.getModel<IChef>(ModelName.Chef);
    this.GameModel = database.getModel<IGame>(ModelName.Game);
  }

  private generateGameCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < constants.GAME_CODE_LENGTH; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return code;
  }

  public async generateNewGameCodeAsync(): Promise<string> {
    // find a game code that is not being used by an active game
    // codes are freed up when currentPhase is GAME_OVER
    let code = '';
    let gameCount = 0;
    let attempts = 1000;
    while (attempts-- > 0) {
      code = this.generateGameCode();
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
    if (await this.userIsInAnyActiveGameAsync(user)) {
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
        code: gameCode,
        name: gameName,
        maxChefs: maxChefs,
        currentPhase: GamePhase.LOBBY,
        currentChef: -1,
        chefIds: [chefId],
        turnOrder: [], // will be chosen when the game is about to start
        hostChefId: chefId,
        hostUserId: user._id,
        ...password ? { password: password } : {},
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
    if (await this.userIsInAnyActiveGameAsync(user)) {
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
        hand: [{ type: CardType.CHILI, faceUp: false }, { type: CardType.CILANTRO, faceUp: false }, { type: CardType.CILANTRO, faceUp: false }, { type: CardType.CILANTRO, faceUp: false }],
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
        code: existingGame.code,
        name: existingGame.name,
        password: existingGame.password,
        maxChefs: existingGame.maxChefs,
        currentPhase: GamePhase.LOBBY,
        currentChef: -1,
        chefIds: newChefIds,
        turnOrder: [], // will be chosen when the game is started
        hostChefId: newChefIds[hostChefIndex],
        hostUserId: existingGame.hostUserId,
        lastGame: existingGame._id,
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
   * Utility method to shuffle array (consider placing this in a shared utility file)
   * @param array
   * @returns shuffled array
   */
  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
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
      if (!await this.isGameHostAsync(userId, game._id)) {
        throw new NotHostError();
      }
      if (game.currentPhase !== GamePhase.LOBBY) {
        throw new GameInProgressError();
      }
      if (game.chefIds.length < constants.MIN_CHEFS) {
        throw new NotEnoughChefsError(game.chefIds.length, constants.MIN_CHEFS);
      }
      game.currentPhase = GamePhase.SETUP;

      // create a random order of players
      // shuffle the chef ids
      game.turnOrder = this.shuffleArray(game.chefIds);

      const savedGame = await game.save();
      const startAction = await this.Database.getActionModel(Action.START_GAME).create({
        gameId: game._id,
        chefId: game.hostChefId,
        userId: game.hostUserId,
        type: Action.START_GAME,
        details: {} as IStartGameDetails,
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
   * Returns whether the specified user is in any active game
   * @param userId
   * @returns boolean
   */
  public async userIsInAnyActiveGameAsync(user: IUser): Promise<boolean> {
    try {
      const result = await this.GameModel.aggregate([
        {
          $match: {
            currentPhase: { $ne: GamePhase.GAME_OVER }
          }
        },
        {
          $lookup: {
            from: ModelData.Chef.collection,
            localField: 'chefIds',
            foreignField: '_id',
            as: 'chefDetails'
          }
        },
        {
          $unwind: '$chefDetails'
        },
        {
          $match: {
            'chefDetails.userId': user._id
          }
        },
        {
          $count: 'activeGamesCount'
        }
      ]).exec(); // exec is optional here, await will work on aggregate directly

      // If the aggregation result is empty, count is 0, otherwise, it's the returned count
      const count = result.length > 0 ? result[0].activeGamesCount : 0;
      return count > 0;
    } catch (err) {
      // Handle the error appropriately
      console.error('Error checking if user is in game:', err);
      throw err;
    }
  }

  /**
   * Returns whether the user is in the specified game, regardless of game state
   * @param userId 
   * @param gameId 
   * @returns boolean
   */
  public async userIsInGameAsync(userId: string, gameId: string, active = false): Promise<boolean> {
    try {
      const result = await this.GameModel.aggregate([
        {
          $match: {
            _id: new ObjectId(gameId),
            ...active ? { currentPhase: { $ne: GamePhase.GAME_OVER } } : {}
          }
        },
        {
          $lookup: {
            from: ModelData.Chef.collection,
            localField: 'chefIds',
            foreignField: '_id',
            as: 'chefDetails'
          }
        },
        {
          $unwind: '$chefDetails'
        },
        {
          $match: {
            'chefDetails.userId': new ObjectId(userId) // Match specific userId
          }
        },
        {
          $count: 'activeGamesCount'
        }
      ]).exec(); // exec is optional here, await will work on aggregate directly

      // If the aggregation result is empty, count is 0, otherwise, it's the returned count
      const count = result.length > 0 ? result[0].activeGamesCount : 0;
      return count > 0;
    } catch (err) {
      // Handle the error appropriately
      console.error('Error checking if user is in the specified game:', err);
      throw err; // Or you might want to return false or handle this differently
    }
  }

  /**
 * Returns whether the specified user is the host of the specified game
 * @param userId
 * @param gameId
 * @returns boolean
 */
  public async isGameHostAsync(userId: string, gameId: string): Promise<boolean> {
    const count = await this.GameModel.countDocuments({
      _id: new ObjectId(gameId),
      hostUserId: new ObjectId(userId)
    }).exec();

    return count > 0;
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
        } as IMessageDetails
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
   * When the game is in setup phase, the current player can place a card or make a bid. This method places a card.
   * @param gameCode 
   * @param user 
   * @param ingredient 
   * @returns A tuple of the updated game and chef objects
   */
  public async placeIngredientAsync(gameCode: string, user: IUser, ingredient: CardType): Promise<{ game: IGame & Document, chef: IChef & Document }> {
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
      if (game.currentPhase !== GamePhase.SETUP) {
        throw new IncorrectGamePhaseError();
      }
      if (game.turnOrder[game.currentChef].toString() !== chef._id.toString()) {
        throw new OutOfOrderError();
      }
      if (chef.placedCards.length >= constants.MAX_HAND_SIZE) {
        throw new AllCardsPlacedError();
      }
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
      // if all players have placed all of their cards, move from setup to bidding
      const chefs = await this.ChefModel.find({ gameId: game._id });
      if (chefs.every(chef => chef.placedCards.length == constants.MAX_HAND_SIZE)) {
        game.currentPhase = GamePhase.BIDDING;
        // TODO: create action for game phase change
        // is the chef who is transitioning the one of just placed their last card or the next chef?
      }
      await game.save();
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
   * Rather than placing a card, the current player can make a bid. This method makes a bid.
   * The game phase will move from SETUP to BIDDING
   * @param gameCode 
   * @param user 
   * @param bid 
   */
  public async makeBidAsync(gameCode: string, user: IUser, bid: number): Promise<{ game: IGame & Document }> {
    throw new Error('Not implemented');
  }
}