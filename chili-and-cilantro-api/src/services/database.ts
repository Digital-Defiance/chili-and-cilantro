import {
  Action,
  BaseModel,
  CreateGameDiscriminator,
  EndGameDiscriminator,
  EndRoundDiscriminator,
  ExpireGameDiscriminator,
  FlipCardDiscriminator,
  IAction,
  JoinGameDiscriminator,
  MakeBidDiscriminator,
  MessageDiscriminator,
  ModelName,
  PassDiscriminator,
  PlaceCardDiscriminator,
  QuitGameDiscriminator,
  StartBiddingDiscriminator,
  StartGameDiscriminator,
  StartNewRoundDiscriminator,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IDatabase } from '../interfaces/database';
import { Model } from 'mongoose';

export class Database implements IDatabase {
  getModel<T>(modelName: ModelName): Model<T> {
    return BaseModel.getModel<T>(modelName);
  }
  getActionModel<T extends IAction>(actionType: Action): Model<T> {
    switch (actionType) {
      case Action.CREATE_GAME:
        return CreateGameDiscriminator as Model<T>;
      case Action.END_GAME:
        return EndGameDiscriminator as Model<T>;
      case Action.END_ROUND:
        return EndRoundDiscriminator as Model<T>;
      case Action.EXPIRE_GAME:
        return ExpireGameDiscriminator as Model<T>;
      case Action.FLIP_CARD:
        return FlipCardDiscriminator as Model<T>;
      case Action.JOIN_GAME:
        return JoinGameDiscriminator as Model<T>;
      case Action.MAKE_BID:
        return MakeBidDiscriminator as Model<T>;
      case Action.MESSAGE:
        return MessageDiscriminator as Model<T>;
      case Action.PASS:
        return PassDiscriminator as Model<T>;
      case Action.PLACE_CARD:
        return PlaceCardDiscriminator as Model<T>;
      case Action.QUIT_GAME:
        return QuitGameDiscriminator as Model<T>;
      case Action.START_BIDDING:
        return StartBiddingDiscriminator as Model<T>;
      case Action.START_GAME:
        return StartGameDiscriminator as Model<T>;
      case Action.START_NEW_ROUND:
        return StartNewRoundDiscriminator as Model<T>;
    }
  }
}
