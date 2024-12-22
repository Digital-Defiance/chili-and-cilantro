import {
  ActionType,
  CardType,
  constants,
  IAction,
  IActionDocument,
  IActionObject,
  IChefDocument,
  ICreateGameAction,
  ICreateGameActionDocument,
  ICreateGameDetails,
  IExpireGameAction,
  IExpireGameActionDocument,
  IExpireGameDetails,
  IGameDocument,
  IJoinGameAction,
  IJoinGameActionDocument,
  IJoinGameDetails,
  IMessageAction,
  IMessageActionDocument,
  IMessageDetails,
  IPassAction,
  IPassActionDocument,
  IPassDetails,
  IPlaceCardAction,
  IPlaceCardActionDocument,
  IPlaceCardDetails,
  IQuitGameAction,
  IQuitGameActionDocument,
  IQuitGameDetails,
  IStartBiddingAction,
  IStartBiddingActionDocument,
  IStartBiddingDetails,
  IStartGameAction,
  IStartGameActionDocument,
  IStartGameDetails,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { ClientSession, Model } from 'mongoose';
import { BaseService } from './base';

export class ActionService extends BaseService {
  private get actionDiscriminatorsByType(): Record<
    ActionType,
    Model<IActionDocument>
  > {
    return this.application.schemaMap.Action.discriminators.byType as Record<
      ActionType,
      Model<IActionDocument>
    >;
  }

  constructor(application: IApplication, useTransactions = true) {
    super(application, useTransactions);
  }

  /**
   * Converts an action document to an action object
   * @param action The action document
   * @returns The action object
   */
  public static actionToActionObject(action: IActionDocument): IActionObject {
    return {
      ...action.toObject(),
      _id: action._id.toString(),
      chefId: action.chefId.toString(),
      gameId: action.gameId.toString(),
      userId: action.userId.toString(),
    } as IActionObject;
  }

  private async createAction<T extends IActionDocument, U extends IAction>(
    action: ActionType,
    data: U,
    session?: ClientSession,
  ): Promise<T> {
    const results = (await this.actionDiscriminatorsByType[action].create(
      [data],
      { session },
    )) as T[];
    if (results.length !== 1) {
      throw new Error('Failed to create action');
    }
    return results[0];
  }

  public async getGameHistoryAsync(
    game: IGameDocument,
    session?: ClientSession,
  ): Promise<IActionDocument[]> {
    const ActionModel = this.application.getModel<IActionDocument>(
      ModelName.Action,
    );
    return await ActionModel.find({ gameId: game._id })
      .sort({
        createdAt: 1,
      })
      .session(session);
  }
  public async createGameAsync(
    game: IGameDocument,
    chef: IChefDocument,
    user: IUserDocument,
    session?: ClientSession,
  ): Promise<ICreateGameActionDocument> {
    return this.createAction<ICreateGameActionDocument, ICreateGameAction>(
      ActionType.CREATE_GAME,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: user._id,
        type: ActionType.CREATE_GAME,
        details: {} as ICreateGameDetails,
        round: constants.NONE,
      } as ICreateGameAction,
      session,
    );
  }
  public async joinGameAsync(
    game: IGameDocument,
    chef: IChefDocument,
    user: IUserDocument,
    session?: ClientSession,
  ): Promise<IJoinGameActionDocument> {
    return this.createAction<IJoinGameActionDocument, IJoinGameAction>(
      ActionType.JOIN_GAME,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: user._id,
        type: ActionType.JOIN_GAME,
        details: {} as IJoinGameDetails,
        round: constants.NONE,
      } as IJoinGameAction,
      session,
    );
  }
  public async startGameAsync(
    game: IGameDocument,
    session?: ClientSession,
  ): Promise<IStartGameActionDocument> {
    return this.createAction<IStartGameActionDocument, IStartGameAction>(
      ActionType.START_GAME,
      {
        gameId: game._id,
        chefId: game.masterChefId,
        userId: game.masterChefUserId,
        type: ActionType.START_GAME,
        details: {} as IStartGameDetails,
        round: game.currentRound,
      } as IStartGameAction,
      session,
    );
  }
  public async expireGameAsync(
    game: IGameDocument,
    session?: ClientSession,
  ): Promise<IExpireGameActionDocument> {
    return this.createAction<IExpireGameActionDocument, IExpireGameAction>(
      ActionType.EXPIRE_GAME,
      {
        gameId: game._id,
        chefId: game.masterChefId,
        userId: game.masterChefUserId,
        type: ActionType.EXPIRE_GAME,
        details: {} as IExpireGameDetails,
        round: game.currentRound,
      } as IExpireGameAction,
      session,
    );
  }
  public async sendMessageAsync(
    game: IGameDocument,
    chef: IChefDocument,
    message: string,
    session?: ClientSession,
  ): Promise<IMessageActionDocument> {
    return this.createAction<IMessageActionDocument, IMessageAction>(
      ActionType.MESSAGE,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: ActionType.MESSAGE,
        details: {
          message: message,
        } as IMessageDetails,
        round: game.currentRound,
      } as IMessageAction,
      session,
    );
  }
  public async startBiddingAsync(
    game: IGameDocument,
    chef: IChefDocument,
    bid: number,
    session?: ClientSession,
  ): Promise<IStartBiddingActionDocument> {
    return this.createAction<IStartBiddingActionDocument, IStartBiddingAction>(
      ActionType.START_BIDDING,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: ActionType.START_BIDDING,
        details: {
          bid: bid,
        } as IStartBiddingDetails,
        round: game.currentRound,
      } as IStartBiddingAction,
      session,
    );
  }
  public async passAsync(
    game: IGameDocument,
    chef: IChefDocument,
    session?: ClientSession,
  ): Promise<IPassActionDocument> {
    return this.createAction<IPassActionDocument, IPassAction>(
      ActionType.PASS,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: ActionType.PASS,
        details: {} as IPassDetails,
        round: game.currentRound,
      } as IPassAction,
      session,
    );
  }
  public async placeCardAsync(
    game: IGameDocument,
    chef: IChefDocument,
    cardType: CardType,
    position: number,
    session?: ClientSession,
  ): Promise<IPlaceCardActionDocument> {
    return this.createAction<IPlaceCardActionDocument, IPlaceCardAction>(
      ActionType.PLACE_CARD,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: ActionType.PLACE_CARD,
        details: {
          cardType: cardType,
          position: position,
        } as IPlaceCardDetails,
        round: game.currentRound,
      } as IPlaceCardAction,
      session,
    );
  }

  public async quitGameAsync(
    game: IGameDocument,
    chef: IChefDocument,
    session?: ClientSession,
  ): Promise<IQuitGameActionDocument> {
    return this.createAction<IQuitGameActionDocument, IQuitGameAction>(
      ActionType.QUIT_GAME,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: ActionType.QUIT_GAME,
        details: {} as IQuitGameDetails,
        round: game.currentRound,
      } as IQuitGameAction,
      session,
    );
  }
}
