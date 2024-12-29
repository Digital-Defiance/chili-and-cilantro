import {
  ActionType,
  CardType,
  constants,
  EndGameReason,
  IAction,
  IActionDocument,
  IActionObject,
  IChefDocument,
  ICreateGameAction,
  ICreateGameActionDocument,
  IEndGameAction,
  IEndGameActionDocument,
  IExpireGameAction,
  IExpireGameActionDocument,
  IGameDocument,
  IJoinGameAction,
  IJoinGameActionDocument,
  IMessageAction,
  IMessageActionDocument,
  IPassAction,
  IPassActionDocument,
  IPlaceCardAction,
  IPlaceCardActionDocument,
  IQuitGameAction,
  IQuitGameActionDocument,
  IStartBiddingAction,
  IStartBiddingActionDocument,
  IStartGameAction,
  IStartGameActionDocument,
  IUserDocument,
  ModelName,
  QuitGameReason,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { ClientSession, Model } from 'mongoose';
import { BaseService } from './base';

export class ActionService extends BaseService {
  constructor(application: IApplication, useTransactions = true) {
    super(application, useTransactions);
  }

  /**
   * Gets the action discriminators by type
   */
  private get actionDiscriminatorsByType(): Record<
    ActionType,
    Model<IActionDocument>
  > {
    return this.application.schemaMap.Action.discriminators.byType as Record<
      ActionType,
      Model<IActionDocument>
    >;
  }

  /**
   * Converts an action document to an action object
   * @param action The action document
   * @returns The action object
   */
  public static actionToActionObject<
    T extends IActionDocument,
    O extends IActionObject,
  >(action: T): O {
    return {
      ...action.toObject(),
      _id: action._id.toString(),
      chefId: action.chefId.toString(),
      gameId: action.gameId.toString(),
      userId: action.userId.toString(),
    } as O;
  }

  /**
   * Creates an action
   * @param action The action type
   * @param data The action data
   * @param session The session
   * @returns The created action
   */
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

  /**
   * Gets the game history
   * @param game The game
   * @param session The db session
   * @returns The game history
   */
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

  /**
   * Creates a game action
   * @param game The game to create
   * @param chef The chef performing the action
   * @param user The user performing the action
   * @param session The db session
   * @returns The created game action
   */
  public async createGameAsync(
    game: IGameDocument,
    chef: IChefDocument,
    user: IUserDocument,
    session?: ClientSession,
  ): Promise<ICreateGameActionDocument> {
    const now = new Date();
    return this.createAction<ICreateGameActionDocument, ICreateGameAction>(
      ActionType.CREATE_GAME,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: user._id,
        type: ActionType.CREATE_GAME,
        details: {},
        round: constants.NONE,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }

  /**
   * Joins a game
   * @param game The game to join
   * @param chef The chef performing the action
   * @param user The user performing the action
   * @param session The db session
   * @returns The created join game action
   */
  public async joinGameAsync(
    game: IGameDocument,
    chef: IChefDocument,
    user: IUserDocument,
    session?: ClientSession,
  ): Promise<IJoinGameActionDocument> {
    const now = new Date();
    return this.createAction<IJoinGameActionDocument, IJoinGameAction>(
      ActionType.JOIN_GAME,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: user._id,
        type: ActionType.JOIN_GAME,
        details: {},
        round: constants.NONE,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }

  /**
   * Starts a game
   * @param game The game to start
   * @param session The db session
   * @returns The created start game action
   */
  public async startGameAsync(
    game: IGameDocument,
    session?: ClientSession,
  ): Promise<IStartGameActionDocument> {
    const now = new Date();
    return this.createAction<IStartGameActionDocument, IStartGameAction>(
      ActionType.START_GAME,
      {
        gameId: game._id,
        chefId: game.masterChefId,
        userId: game.masterChefUserId,
        type: ActionType.START_GAME,
        details: {},
        round: game.currentRound,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }

  /**
   * Ends a game
   * @param game The game to end
   * @param reason The reason for ending the game
   * @param session The db session
   * @returns The created end game action
   */
  public async endGameAsync(
    game: IGameDocument,
    reason: EndGameReason,
    session?: ClientSession,
  ): Promise<IEndGameActionDocument> {
    const now = new Date();
    return this.createAction<IEndGameActionDocument, IEndGameAction>(
      ActionType.END_GAME,
      {
        gameId: game._id,
        chefId: game.masterChefId,
        userId: game.masterChefUserId,
        type: ActionType.END_GAME,
        details: {
          reason: reason,
        },
        round: game.currentRound,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }

  /**
   * Expires a game
   * @param game The game to expire
   * @param session The db session
   * @returns The created expire game action
   */
  public async expireGameAsync(
    game: IGameDocument,
    session?: ClientSession,
  ): Promise<IExpireGameActionDocument> {
    const now = new Date();
    return this.createAction<IExpireGameActionDocument, IExpireGameAction>(
      ActionType.EXPIRE_GAME,
      {
        gameId: game._id,
        chefId: game.masterChefId,
        userId: game.masterChefUserId,
        type: ActionType.EXPIRE_GAME,
        details: {},
        round: game.currentRound,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }

  /**
   * Sends a message
   * @param game The game to send a message to
   * @param chef The chef sending the message
   * @param message The message to send
   * @param session The db session
   * @returns The created message action
   */
  public async sendMessageAsync(
    game: IGameDocument,
    chef: IChefDocument,
    message: string,
    session?: ClientSession,
  ): Promise<IMessageActionDocument> {
    const now = new Date();
    return this.createAction<IMessageActionDocument, IMessageAction>(
      ActionType.MESSAGE,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: ActionType.MESSAGE,
        details: {
          message: message,
        },
        round: game.currentRound,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }

  /**
   * Starts bidding
   * @param game The game to start bidding for
   * @param chef The chef starting the bidding
   * @param bid The bid amount
   * @param session The db session
   * @returns The created start bidding action
   */
  public async startBiddingAsync(
    game: IGameDocument,
    chef: IChefDocument,
    bid: number,
    session?: ClientSession,
  ): Promise<IStartBiddingActionDocument> {
    const now = new Date();
    return this.createAction<IStartBiddingActionDocument, IStartBiddingAction>(
      ActionType.START_BIDDING,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: ActionType.START_BIDDING,
        details: {
          bid: bid,
        },
        round: game.currentRound,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }

  /**
   * Passes
   * @param game The game to pass for
   * @param chef The chef passing
   * @param session The db session
   * @returns The created pass action
   */
  public async passAsync(
    game: IGameDocument,
    chef: IChefDocument,
    session?: ClientSession,
  ): Promise<IPassActionDocument> {
    const now = new Date();
    return this.createAction<IPassActionDocument, IPassAction>(
      ActionType.PASS,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: ActionType.PASS,
        details: {},
        round: game.currentRound,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }

  /**
   * Places a card
   * @param game The game to place a card for
   * @param chef The chef placing the card
   * @param cardType The card type to place
   * @param position The position to place the card
   * @param session The db session
   * @returns The created place card action
   */
  public async placeCardAsync(
    game: IGameDocument,
    chef: IChefDocument,
    cardType: CardType,
    position: number,
    session?: ClientSession,
  ): Promise<IPlaceCardActionDocument> {
    const now = new Date();
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
        },
        round: game.currentRound,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }

  /**
   * Quits a game
   * @param game The game to quit
   * @param chef The chef quitting
   * @param session The db session
   * @returns The created quit game action
   */
  public async quitGameAsync(
    game: IGameDocument,
    chef: IChefDocument,
    reason: QuitGameReason,
    session?: ClientSession,
  ): Promise<IQuitGameActionDocument> {
    const now = new Date();
    return this.createAction<IQuitGameActionDocument, IQuitGameAction>(
      ActionType.QUIT_GAME,
      {
        gameId: game._id,
        chefId: chef._id,
        userId: chef.userId,
        type: ActionType.QUIT_GAME,
        details: {
          reason: reason,
        },
        round: game.currentRound,
        createdAt: now,
        updatedAt: now,
      },
      session,
    );
  }
}
