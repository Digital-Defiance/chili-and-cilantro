import { Model } from 'mongoose';
import { IUser } from './user';
import { IGame } from './game';
import { IAction } from './action';
import { IChef } from './chef';
import { ICreateGameAction } from './createGameAction';
import { IEndGameAction } from './endGameAction';
import { IEndRoundAction } from './endRoundAction';
import { IExpireGameAction } from './expireGameAction';
import { IFlipCardAction } from './flipCardAction';
import { IJoinGameAction } from './joinGameAction';
import { IMakeBidAction } from './makeBidAction';
import { IMessageAction } from './messageAction';
import { IPassAction } from './passAction';
import { IPlaceCardAction } from './placeCardAction';
import { IQuitGameAction } from './quitGameAction';
import { IStartBiddingAction } from './startBiddingAction';
import { IStartGameAction } from './startGameAction';
import { IStartNewRoundAction } from './startNewRoundAction';

export interface ISchemaModels {
  Action: Model<IAction>;
  Actions: {
    CreateGame: Model<ICreateGameAction>;
    EndGame: Model<IEndGameAction>;
    EndRound: Model<IEndRoundAction>;
    ExpireGame: Model<IExpireGameAction>;
    FlipCard: Model<IFlipCardAction>;
    JoinGame: Model<IJoinGameAction>;
    MakeBid: Model<IMakeBidAction>;
    Message: Model<IMessageAction>;
    Pass: Model<IPassAction>;
    PlaceCard: Model<IPlaceCardAction>;
    QuitGame: Model<IQuitGameAction>;
    StartBidding: Model<IStartBiddingAction>;
    StartGame: Model<IStartGameAction>;
    StartNewRound: Model<IStartNewRoundAction>;
  }
  Chef: Model<IChef>;
  Game: Model<IGame>;
  User: Model<IUser>;
}
