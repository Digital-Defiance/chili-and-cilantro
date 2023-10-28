import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import validator from 'validator';
import {
  Action,
  BaseModel,
  FirstChef,
  IAction, IUser, IGame, IChef,
  ModelName,
  ChefState,
  GamePhase,
  ICreateGameAction,
  ICreateGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { AlreadyJoinedError } from '../errors/alreadyJoined';
import { GameFullError } from '../errors/gameFull';
import { GameInProgressError } from '../errors/gameInProgress';
import { GamePasswordMismatchError } from '../errors/gamePasswordMismatch';
import { InvalidGameError } from '../errors/invalidGame';
import { InvalidGameNameError } from '../errors/invalidGameName';
import { InvalidGamePasswordError } from '../errors/invalidGamePassword';
import { InvalidGameParameterError } from '../errors/invalidGameParameter';
import { InvalidUserNameError } from '../errors/invalidUserName';
import { NotEnoughChefsError } from '../errors/notEnoughChefs';


export const MAX_CHEFS = 8;
export const MIN_CHEFS = 3;
export const MIN_PASSWORD_LENGTH = 3;
export const MAX_PASSWORD_LENGTH = 30;
export const MIN_GAME_NAME_LENGTH = 2;
export const MAX_GAME_NAME_LENGTH = 255;
export const MIN_USER_NAME_LENGTH = 2;
export const MAX_USER_NAME_LENGTH = 255;

export class GameService {
  private readonly ActionModel = BaseModel.getModel<IAction>(ModelName.Action);
  private readonly ChefModel = BaseModel.getModel<IChef>(ModelName.Chef);
  private readonly GameModel = BaseModel.getModel<IGame>(ModelName.Game);

  public async createGame(user: IUser, userName: string, gameName: string, password: string, maxChefs: number, firstChef: FirstChef): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    if (!validator.isAlphanumeric(userName) || userName.length < MIN_USER_NAME_LENGTH || userName.length > MAX_USER_NAME_LENGTH) {
      throw new InvalidUserNameError();
    }
    if (!validator.isAlphanumeric(gameName) || gameName.length < MIN_GAME_NAME_LENGTH || gameName.length > MAX_GAME_NAME_LENGTH) {
      throw new InvalidGameNameError();
    }
    if (password.length > 0 && (!validator.isAlphanumeric(password) || password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH)) {
      throw new InvalidGamePasswordError();
    }
    if (maxChefs < 2 || maxChefs > MAX_CHEFS) {
      throw new InvalidGameParameterError(`Must be between 2 and ${MAX_CHEFS}.`, 'maxChefs');
    }
    if (!firstChef || !Object.values(FirstChef).includes(firstChef)) {
      throw new InvalidGameParameterError('Must be a valid first chef option.', 'firstChef');
    }
    const gameId = new ObjectId();
    const chefId = new ObjectId();
    const game = await this.GameModel.create({
      _id: gameId,
      name: gameName,
      password,
      maxChefs: maxChefs,
      currentPhase: GamePhase.LOBBY,
      currentChef: -1,
      firstChef: firstChef,
      chefs: [chefId],
      turnOrder: [chefId], // will be chosen when the game is about to start
      host: user._id,
    });
    const chef = await this.ChefModel.create({
      _id: chefId,
      gameId: gameId,
      userId: user._id,
      hand: [],
      state: ChefState.LOBBY,
      host: true,
    });
    const action = await this.ActionModel.create({
      chef: chef._id,
      type: Action.CREATE_GAME,
      details: {},
    });
    return { game, chef };
  }

  public async joinGame(gameId: string, password: string, user: IUser, userName: string): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    const game = await this.GameModel.findOne({ _id: gameId });
    if (!game) {
      throw new InvalidGameError();
    }
    if (game.password !== password) {
      throw new GamePasswordMismatchError();
    }
    if (game.currentPhase !== GamePhase.LOBBY) {
      throw new GameInProgressError();
    }
    if (game.chefs.length >= game.maxChefs) {
      throw new GameFullError();
    }
    if (!validator.isAlphanumeric(userName) || userName.length < MIN_USER_NAME_LENGTH || userName.length > MAX_USER_NAME_LENGTH) {
      throw new InvalidUserNameError();
    }
    // check if the chef is already in the game
    const existingChef = this.ChefModel.findOne({ gameId: game._id, userId: user._id });
    if (existingChef) {
      throw new AlreadyJoinedError();
    }
    const chef = await this.ChefModel.create({
      gameId: game._id,
      userId: user._id,
      hand: [],
      state: ChefState.LOBBY,
      host: false,
    });
    const action = await this.ActionModel.create({
      chef: chef._id,
      type: Action.JOIN_GAME,
      details: {},
    })
    game.chefs.push(chef._id);
    await game.save();
    return { game, chef };
  }

  public async createNewGameFromExisting(existingGameId: string, firstChef: FirstChef): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    const existingGame = await this.GameModel.findOne({ _id: existingGameId });
    if (!existingGame) {
      throw new InvalidGameError();
    }
    const gameId = new ObjectId();
    const chefId = new ObjectId();
    const game = await this.GameModel.create({
      _id: gameId,
      name: existingGame.name,
      password: existingGame.password,
      maxChefs: existingGame.maxChefs,
      currentPhase: GamePhase.LOBBY,
      currentChef: -1,
      firstChef: firstChef,
      chefs: [chefId],
      turnOrder: [chefId], // will be chosen when the game is about to start
      host: existingGame.host,
    });
    const chef = await this.ChefModel.create({
      _id: chefId,
      gameId: gameId,
      userId: existingGame.host,
      hand: [],
      state: ChefState.LOBBY,
      host: true,
    });
    const action = await this.ActionModel.create({
      chef: chef._id,
      type: Action.CREATE_GAME,
      details: {},
    });
    return { game, chef };
  }

  // Utility method to shuffle array (consider placing this in a shared utility file)
  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  public async startGame(gameId: string, firstChefId?: string): Promise<IGame & Document> {
    const game = await this.GameModel.findOne({ _id: gameId });
    if (!game) {
      throw new InvalidGameError();
    }
    if (game.currentPhase !== GamePhase.LOBBY) {
      throw new GameInProgressError();
    }
    if (game.chefs.length < MIN_CHEFS) {
      throw new NotEnoughChefsError(game.chefs.length, MIN_CHEFS);
    }
    game.currentPhase = GamePhase.SETUP;
    // if a firstChefId is provided, they go first and the turn order is randomized
    // create a random order of players
    // turnOrder is an array of chef ids, in order
    const chefIds = game.chefs.map(chef => chef.toString());
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
    return savedGame;
  }
}