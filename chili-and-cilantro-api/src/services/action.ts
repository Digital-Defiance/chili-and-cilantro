import { Document, Model, Schema } from 'mongoose';
import {
  constants,
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
  CardType,
  IPlaceCardAction,
  IPlaceCardDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IDatabase } from '../interfaces/database';

export class ActionService {
  private readonly Database: IDatabase;
  constructor(database: IDatabase) {
    this.Database = database;
  }
  public async getGameHistoryAsync(game: IGame): Promise<IAction[]> {
    const actions = await this.Database.getModel<IAction>(ModelName.Action).find({ gameId: game._id }).sort({
      createdAt: 1,
    });
    return actions;
  }
  public async createGameAsync(
    game: IGame,
    chef: IChef,
    user: IUser
  ): Promise<Document<Schema.Types.ObjectId, {}, ICreateGameAction> & ICreateGameAction> {
    const result = await this.Database.getActionModel<ICreateGameAction>(
      Action.CREATE_GAME
    ).create({
      gameId: game._id,
      chefId: chef._id,
      userId: user._id,
      type: Action.CREATE_GAME,
      details: {} as ICreateGameDetails,
      round: constants.NONE,
    } as ICreateGameAction);
    return result;
  }
  public async joinGameAsync(
    game: IGame,
    chef: IChef,
    user: IUser
  ): Promise<Document<Schema.Types.ObjectId, {}, IJoinGameAction> & IJoinGameAction> {
    const result = await this.Database.getActionModel<IJoinGameAction>(Action.JOIN_GAME).create({
      gameId: game._id,
      chefId: chef._id,
      userId: user._id,
      type: Action.JOIN_GAME,
      details: {} as IJoinGameDetails,
      round: constants.NONE,
    } as IJoinGameAction);
    return result;
  }
  public async startGameAsync(game: IGame): Promise<Document<Schema.Types.ObjectId, {}, IStartGameAction> & IStartGameAction> {
    const result = await this.Database.getActionModel<IStartGameAction>(Action.START_GAME).create(
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
  public async expireGameAsync(game: IGame): Promise<Document<Schema.Types.ObjectId, {}, IExpireGameAction> & IExpireGameAction> {
    const result = this.Database.getActionModel<IExpireGameAction>(Action.EXPIRE_GAME).create({
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
  ): Promise<Document<Schema.Types.ObjectId, {}, IMessageAction> & IMessageAction> {
    const result = await this.Database.getActionModel<IMessageAction>(Action.MESSAGE).create({
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
  ): Promise<Document<Schema.Types.ObjectId, {}, IStartBiddingAction> & IStartBiddingAction> {
    const result = await this.Database.getActionModel<IStartBiddingAction>(
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
  public async passAsync(game: IGame, chef: IChef): Promise<Document<Schema.Types.ObjectId, {}, IPassAction> & IPassAction> {
    const result = await this.Database.getActionModel<IPassAction>(Action.PASS).create({
      gameId: game._id,
      chefId: chef._id,
      userId: chef.userId,
      type: Action.PASS,
      details: {} as IPassDetails,
      round: game.currentRound,
    } as IPassAction);
    return result;
  }
  public async placeCardAsync(game: IGame, chef: IChef, cardType: CardType, position: number): Promise<Document<Schema.Types.ObjectId, {}, IPlaceCardAction> & IPlaceCardAction> {
    const result = await this.Database.getActionModel<IPlaceCardAction>(Action.PLACE_CARD).create({
      gameId: game._id,
      chefId: chef._id,
      userId: chef.userId,
      type: Action.PLACE_CARD,
      details: {
        cardType: cardType,
        position: position,
      } as IPlaceCardDetails,
      round: game.currentRound,
    } as IPlaceCardAction);
    return result;
  }
}
