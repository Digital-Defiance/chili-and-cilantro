import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import {
  Action,
  BaseModel,
  IAction, IUser, IGame, IPlayer,
  ModelName,
  PlayerState,
  GamePhase,
  ICreateGameAction,
  ICreateGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { InvalidGameError } from '../errors/invalidGame';
import { InvalidPasswordError } from '../errors/invalidPassword';

const ActionModel = BaseModel.getModel<IAction>(ModelName.Action);
const GameModel = BaseModel.getModel<IGame>(ModelName.Game);
const PlayerModel = BaseModel.getModel<IPlayer>(ModelName.Player);

export class GameService {
  constructor() {

  }

  public async createGame(user: IUser, name: string, password: string, maxPlayers: number): Promise<{ game: IGame & Document, player: IPlayer & Document }> {
    const gameId = new ObjectId();
    const playerId = new ObjectId();
    const game = await GameModel.create({
      _id: gameId,
      name,
      password,
      maxPlayers,
      gamePhase: GamePhase.LOBBY,
      players: [playerId],
      owner: user._id,
    });
    const player = await PlayerModel.create({
      _id: playerId,
      gameId: gameId,
      userId: user._id,
      hand: [],
      state: PlayerState.LOBBY,
      owner: true,
    });
    const action = await ActionModel.create({
      player: player._id,
      type: Action.CREATE_GAME,
      details: {},
    });
    return { game, player };
  }

  public async joinGame(user: IUser, gameId: string, password: string): Promise<{ game: IGame & Document, player: IPlayer & Document }> {
    const game = await GameModel.findOne({ _id: gameId });
    if (!game) {
      throw new InvalidGameError();
    }
    if (game.password !== password) {
      throw new InvalidPasswordError();
    }
    if (game.currentPhase !== GamePhase.LOBBY) {
      throw new Error('Game has already started');
    }
    if (game.players.length >= game.maxPlayers) {
      throw new Error('Game is full');
    }
    const player = await PlayerModel.create({
      gameId: game._id,
      userId: user._id,
      hand: [],
      state: PlayerState.LOBBY,
      owner: false,
    });
    const action = await ActionModel.create({
      player: player._id,
      type: Action.JOIN_GAME,
      details: {},
    })
    game.players.push(player._id);
    await game.save();
    return { game, player };
  }
}