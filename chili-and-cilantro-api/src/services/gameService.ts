import { ObjectId } from 'mongodb';
import { Document, Model, startSession } from 'mongoose';
import validator from 'validator';
import {
  constants,
  Action,
  FirstChef,
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
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { AlreadyJoinedError } from '../errors/alreadyJoined';
import { AlreadyJoinedOtherError } from '../errors/alreadyJoinedOther';
import { GameFullError } from '../errors/gameFull';
import { GameInProgressError } from '../errors/gameInProgress';
import { GamePasswordMismatchError } from '../errors/gamePasswordMismatch';
import { InvalidGameError } from '../errors/invalidGame';
import { InvalidGameNameError } from '../errors/invalidGameName';
import { InvalidGamePasswordError } from '../errors/invalidGamePassword';
import { InvalidGameParameterError } from '../errors/invalidGameParameter';
import { InvalidUserNameError } from '../errors/invalidUserName';
import { InvalidMessageError } from '../errors/invalidMessage';
import { NotEnoughChefsError } from '../errors/notEnoughChefs';
import { NotHostError } from '../errors/notHost';
import { NotInGameError } from '../errors/notInGame';
import { IDatabase } from '../interfaces/database';

export class GameService {
  private readonly Database: IDatabase;
  private readonly ChefModel: Model<IChef>;
  private readonly GameModel: Model<IGame>;

  constructor(database: IDatabase) {
    this.Database = database;
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


  public async createGameAsync(user: IUser, userName: string, gameName: string, password: string, maxChefs: number, firstChef: FirstChef): Promise<{ game: IGame & Document, chef: IChef & Document }> {
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
    if (!firstChef || !Object.values(FirstChef).includes(firstChef)) {
      throw new InvalidGameParameterError('Must be a valid first chef option.', 'firstChef');
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
        firstChef: firstChef,
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
      // check if the chef is already in the game
      const existingChef = this.ChefModel.findOne({ gameId: game._id, userId: user._id });
      if (existingChef) {
        throw new AlreadyJoinedError();
      }
      const chef = await this.ChefModel.create({
        gameId: game._id,
        userId: user._id,
        name: userName,
        hand: [],
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

  public async createNewGameFromExistingAsync(
    existingGameId: string,
    firstChef: FirstChef
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
      const existingChefs = await this.ChefModel.find({ _id: { $in: existingGame.chefIds } });

      // Create the new Game document without persisting to the database yet
      const newGame = new this.GameModel({
        code: existingGame.code,
        name: existingGame.name,
        password: existingGame.password,
        maxChefs: existingGame.maxChefs,
        currentPhase: GamePhase.LOBBY,
        currentChef: -1,
        firstChef,
        chefIds: newChefIds,
        turnOrder: [], // will be chosen when the game is about to start
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
          hand: [],
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
   * @param firstChefId 
   * @returns 
   */
  public async startGameAsync(userId: string, gameId: string, firstChefId?: string): Promise<IGame & Document> {
    if (!await this.isGameHostAsync(userId, gameId)) {
      throw new NotHostError();
    }
    const session = await startSession();
    try {
      session.startTransaction();
      const game = await this.GameModel.findOne({ _id: gameId });
      if (!game) {
        throw new InvalidGameError();
      }
      if (game.currentPhase !== GamePhase.LOBBY) {
        throw new GameInProgressError();
      }
      if (game.chefIds.length < constants.MIN_CHEFS) {
        throw new NotEnoughChefsError(game.chefIds.length, constants.MIN_CHEFS);
      }
      game.currentPhase = GamePhase.SETUP;
      // if a firstChefId is provided, they go first and the turn order is randomized
      // create a random order of players
      // turnOrder is an array of chef ids, in order
      const chefIds = game.chefIds.map(chef => chef.toString());
      if (firstChefId) {
        // Verify the firstChefId is valid and part of the game
        if (!chefIds.includes(firstChefId)) {
          throw new InvalidGameParameterError('First chef must be one of the chefs in the game.', 'firstChefId');
        }

        // Prepare the turn order
        const firstChefIndex = chefIds.indexOf(firstChefId);
        const remainingChefs = [...chefIds]; // Clone the array
        remainingChefs.splice(firstChefIndex, 1); // Remove the firstChefId
        const shuffledRemainingChefs = this.shuffleArray(remainingChefs); // Implement or use a utility method to shuffle the array

        game.turnOrder = [firstChefId, ...shuffledRemainingChefs]; // Combine the first chef with the shuffled remaining chefs
      } else {
        // Handle the case when no firstChefId is provided
        // For example, shuffle all chefs and set the turn order
        game.turnOrder = this.shuffleArray(chefIds);
        game.currentChef = 0;
      }
      const savedGame = await game.save();
      await this.Database.getActionModel(Action.START_GAME).create({
        gameId: game._id,
        chefId: game.hostChefId,
        userId: game.hostUserId,
        type: Action.START_GAME,
        details: {} as IStartGameDetails,
      } as IStartGameAction);
      await session.commitTransaction();
      return savedGame;
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
    const search = active ? { _id: gameId, currentPhase: { $ne: GamePhase.GAME_OVER } } : { _id: gameId };
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

  public async sendMessageAsync(userId: string, gameId: string, message: string): Promise<void> {
    const session = await startSession();
    try {
      session.startTransaction();
      const game = await this.getGameByIdAsync(gameId, true);
      if (!game) {
        throw new InvalidGameError();
      }
      const chef = this.ChefModel.findOne({ gameId: game._id, userId: userId });
      if (!chef) {
        throw new NotInGameError();
      }
      if (message.length < constants.MIN_MESSAGE_LENGTH || message.length > constants.MAX_MESSAGE_LENGTH) {
        throw new InvalidMessageError();
      }
      const actionMessage = await this.Database.getActionModel(Action.MESSAGE).create({
        details: {
          message: message,
        } as IMessageDetails
      } as IMessageAction);
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