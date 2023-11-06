import {
  Action,
  BaseModel,
  CreateGameDiscriminator,
  EndGameDiscriminator,
  EndRoundDiscriminator,
  ExpireGameDiscriminator,
  FlipCardDiscriminator,
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
import { Document, IfAny, Model, Require_id } from 'mongoose';

export class Database implements IDatabase {
  getModel<T>(modelName: ModelName): Model<T> {
    return BaseModel.getModel<T>(modelName);
  }
  getActionModel(actionType: Action): Model<unknown> {
    switch (actionType) {
      case Action.CREATE_GAME:
        return CreateGameDiscriminator;
      case Action.END_GAME:
        return EndGameDiscriminator;
      case Action.END_ROUND:
        return EndRoundDiscriminator;
      case Action.EXPIRE_GAME:
        return ExpireGameDiscriminator;
      case Action.FLIP_CARD:
        return FlipCardDiscriminator;
      case Action.JOIN_GAME:
        return JoinGameDiscriminator;
      case Action.MAKE_BID:
        return MakeBidDiscriminator;
      case Action.MESSAGE:
        return MessageDiscriminator;
      case Action.PASS:
        return PassDiscriminator;
      case Action.PLACE_CARD:
        return PlaceCardDiscriminator;
      case Action.QUIT_GAME:
        return QuitGameDiscriminator;
      case Action.START_BIDDING:
        return StartBiddingDiscriminator;
      case Action.START_GAME:
        return StartGameDiscriminator;
      case Action.START_NEW_ROUND:
        return StartNewRoundDiscriminator;
    }
  }
}
