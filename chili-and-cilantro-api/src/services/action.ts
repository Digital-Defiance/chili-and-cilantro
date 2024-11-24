import {
  ActionType,
  CardType,
  constants,
  IAction,
  IActionDocument,
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
  IStartBiddingAction,
  IStartBiddingActionDocument,
  IStartBiddingDetails,
  IStartGameAction,
  IStartGameActionDocument,
  IStartGameDetails,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  ActionDiscriminatorsByActionType,
  GetModelFunction,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';

export class ActionService {
  private readonly getModel: GetModelFunction;
  constructor(getModel: GetModelFunction) {
    this.getModel = getModel;
  }
  public async getGameHistoryAsync(game: IGameDocument): Promise<IAction[]> {
    const ActionModel = this.getModel<IActionDocument>(ModelName.Action);
    return ActionModel.find({ gameId: game._id }).sort({
      createdAt: 1,
    });
  }
  public async createGameAsync(
    game: IGameDocument,
    chef: IChefDocument,
    user: IUserDocument,
  ): Promise<ICreateGameActionDocument> {
    return ActionDiscriminatorsByActionType.CREATE_GAME.create({
      gameId: game._id,
      chefId: chef._id,
      userId: user._id,
      type: ActionType.CREATE_GAME,
      details: {} as ICreateGameDetails,
      round: constants.NONE,
    } as ICreateGameAction);
  }
  public async joinGameAsync(
    game: IGameDocument,
    chef: IChefDocument,
    user: IUserDocument,
  ): Promise<IJoinGameActionDocument> {
    return ActionDiscriminatorsByActionType.JOIN_GAME.create({
      gameId: game._id,
      chefId: chef._id,
      userId: user._id,
      type: ActionType.JOIN_GAME,
      details: {} as IJoinGameDetails,
      round: constants.NONE,
    } as IJoinGameAction);
  }
  public async startGameAsync(
    game: IGameDocument,
  ): Promise<IStartGameActionDocument> {
    return ActionDiscriminatorsByActionType.START_GAME.create({
      gameId: game._id,
      chefId: game.hostChefId,
      userId: game.hostUserId,
      type: ActionType.START_GAME,
      details: {} as IStartGameDetails,
      round: game.currentRound,
    } as IStartGameAction);
  }
  public async expireGameAsync(
    game: IGameDocument,
  ): Promise<IExpireGameActionDocument> {
    return ActionDiscriminatorsByActionType.EXPIRE_GAME.create({
      gameId: game._id,
      chefId: game.hostChefId,
      userId: game.hostUserId,
      type: ActionType.EXPIRE_GAME,
      details: {} as IExpireGameDetails,
      round: game.currentRound,
    } as IExpireGameAction);
  }
  public async sendMessageAsync(
    game: IGameDocument,
    chef: IChefDocument,
    message: string,
  ): Promise<IMessageActionDocument> {
    return ActionDiscriminatorsByActionType.MESSAGE.create({
      gameId: game._id,
      chefId: chef._id,
      userId: chef.userId,
      type: ActionType.MESSAGE,
      details: {
        message: message,
      } as IMessageDetails,
      round: game.currentRound,
    } as IMessageAction);
  }
  public async startBiddingAsync(
    game: IGameDocument,
    chef: IChefDocument,
    bid: number,
  ): Promise<IStartBiddingActionDocument> {
    return ActionDiscriminatorsByActionType.START_BIDDING.create({
      gameId: game._id,
      chefId: chef._id,
      userId: chef.userId,
      type: ActionType.START_BIDDING,
      details: {
        bid: bid,
      } as IStartBiddingDetails,
      round: game.currentRound,
    } as IStartBiddingAction);
  }
  public async passAsync(
    game: IGameDocument,
    chef: IChefDocument,
  ): Promise<IPassActionDocument> {
    return ActionDiscriminatorsByActionType.PASS.create({
      gameId: game._id,
      chefId: chef._id,
      userId: chef.userId,
      type: ActionType.PASS,
      details: {} as IPassDetails,
      round: game.currentRound,
    } as IPassAction);
  }
  public async placeCardAsync(
    game: IGameDocument,
    chef: IChefDocument,
    cardType: CardType,
    position: number,
  ): Promise<IPlaceCardActionDocument> {
    return ActionDiscriminatorsByActionType.PLACE_CARD.create({
      gameId: game._id,
      chefId: chef._id,
      userId: chef.userId,
      type: ActionType.PLACE_CARD,
      details: {
        cardType: cardType,
        position: position,
      } as IPlaceCardDetails,
      round: game.currentRound,
    } as IPlaceCardAction);
  }
}
