import { Document, Model } from 'mongoose';
import {
  Action,
  IAction,
  ICreateGameAction,
  ICreateGameDetails,
  IExpireGameAction,
  IExpireGameDetails,
  IJoinGameAction,
  IJoinGameDetails,
  IMessageAction,
  IMessageDetails,
  IStartGameAction,
  IStartGameDetails,
  IChef,
  IGame,
  IUser,
  ModelName,
  IStartBiddingDetails,
  IStartBiddingAction,
  IPassDetails,
  IPassAction,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IDatabase } from '../interfaces/database';

export class ActionService {
  private readonly Database: IDatabase;
  private readonly ActionModel: Model<IAction>;
  constructor(database: IDatabase) {
    this.Database = database;
    this.ActionModel = database.getModel<IAction>(ModelName.Action);
  }
  public async getGameHistoryAsync(game: IGame): Promise<IAction[]> {
    const actions = await this.ActionModel.find({ gameId: game._id }).sort({
      createdAt: 1,
    });
    return actions;
  }
  public async createGameAsync(
    game: IGame,
    chef: IChef,
    user: IUser
  ): Promise<Document<unknown>> {
    const result = await this.Database.getActionModel(
      Action.CREATE_GAME
    ).create({
      gameId: game._id,
      chefId: chef._id,
      userId: user._id,
      type: Action.CREATE_GAME,
      details: {} as ICreateGameDetails,
      round: -1,
    } as ICreateGameAction);
    return result;
  }
  public async joinGameAsync(
    game: IGame,
    chef: IChef,
    user: IUser
  ): Promise<Document<unknown>> {
    const result = await this.Database.getActionModel(Action.JOIN_GAME).create({
      gameId: game._id,
      chefId: chef._id,
      userId: user._id,
      type: Action.JOIN_GAME,
      details: {} as IJoinGameDetails,
      round: -1,
    } as IJoinGameAction);
    return result;
  }
  public async startGameAsync(game: IGame): Promise<Document<unknown>> {
    const result = await this.Database.getActionModel(Action.START_GAME).create(
      {
        gameId: game._id,
        chefId: game.hostChefId,
        userId: game.hostUserId,
        type: Action.START_GAME,
        details: {} as IStartGameDetails,
        round: game.currentRound,
      } as IStartGameAction
    );
    return result;
  }
  public async expireGameAsync(game: IGame): Promise<Document<unknown>> {
    const result = this.Database.getActionModel(Action.EXPIRE_GAME).create({
      gameId: game._id,
      chefId: game.hostChefId,
      userId: game.hostUserId,
      type: Action.EXPIRE_GAME,
      details: {} as IExpireGameDetails,
      round: game.currentRound,
    } as IExpireGameAction);
    return result;
  }
  public async sendMessageAsync(
    game: IGame,
    chef: IChef,
    message: string
  ): Promise<Document<unknown>> {
    const result = await this.Database.getActionModel(Action.MESSAGE).create({
      gameId: game._id,
      chefId: chef._id,
      userId: chef.userId,
      type: Action.MESSAGE,
      details: {
        message: message,
      } as IMessageDetails,
      round: game.currentRound,
    } as IMessageAction);
    return result;
  }
  public async startBiddingAsync(
    game: IGame,
    chef: IChef,
    bid: number
  ): Promise<Document<unknown>> {
    const result = await this.Database.getActionModel(
      Action.START_BIDDING
    ).create({
      gameId: game._id,
      chefId: chef._id,
      userId: chef.userId,
      type: Action.START_BIDDING,
      details: {
        bid: bid,
      } as IStartBiddingDetails,
      round: game.currentRound,
    } as IStartBiddingAction);
    return result;
  }
  public async passAsync(game: IGame, chef: IChef): Promise<Document<unknown>> {
    const result = await this.Database.getActionModel(Action.PASS).create({
      gameId: game._id,
      chefId: chef._id,
      userId: chef.userId,
      type: Action.PASS,
      details: {} as IPassDetails,
      round: game.currentRound,
    } as IPassAction);
    return result;
  }
}
