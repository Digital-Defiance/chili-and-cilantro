import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
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
import { InvalidGameError } from '../errors/invalidGame';
import { InvalidPasswordError } from '../errors/invalidPassword';

const ActionModel = BaseModel.getModel<IAction>(ModelName.Action);
const ChefModel = BaseModel.getModel<IChef>(ModelName.Chef);
const GameModel = BaseModel.getModel<IGame>(ModelName.Game);

export class GameService {
  constructor() {

  }

  public async createGame(user: IUser, name: string, password: string, maxChefs: number, firstChef: FirstChef): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    const gameId = new ObjectId();
    const chefId = new ObjectId();
    const game = await GameModel.create({
      _id: gameId,
      name,
      password,
      maxChefs: maxChefs,
      gamePhase: GamePhase.LOBBY,
      currentChef: 0,
      firstChef: firstChef,
      chefs: [chefId],
      turnOrder: [chefId], // will be chosen when the game is about to start
      host: user._id,
    });
    const chef = await ChefModel.create({
      _id: chefId,
      gameId: gameId,
      userId: user._id,
      hand: [],
      state: ChefState.LOBBY,
      host: true,
    });
    const action = await ActionModel.create({
      chef: chef._id,
      type: Action.CREATE_GAME,
      details: {},
    });
    return { game, chef: chef };
  }

  public async joinGame(user: IUser, gameId: string, password: string): Promise<{ game: IGame & Document, chef: IChef & Document }> {
    const game = await GameModel.findOne({ _id: gameId });
    if (!game) {
      throw new InvalidGameError();
    }
    if (game.password !== password) {
      throw new InvalidPasswordError('Invalid game password');
    }
    if (game.currentPhase !== GamePhase.LOBBY) {
      throw new Error('Game has already started');
    }
    if (game.chefs.length >= game.maxChefs) {
      throw new Error('Game is full');
    }
    const chef = await ChefModel.create({
      gameId: game._id,
      userId: user._id,
      hand: [],
      state: ChefState.LOBBY,
      host: false,
    });
    const action = await ActionModel.create({
      chef: chef._id,
      type: Action.JOIN_GAME,
      details: {},
    })
    game.chefs.push(chef._id);
    await game.save();
    return { game, chef: chef };
  }
}