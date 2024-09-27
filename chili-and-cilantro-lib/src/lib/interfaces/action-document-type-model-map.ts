import { ICreateGameAction } from "./models/actions/create-game";
import { IEndGameAction } from "./models/actions/end-game";
import { IEndRoundAction } from "./models/actions/end-round";
import { IExpireGameAction } from "./models/actions/expire-game";
import { IFlipCardAction } from "./models/actions/flip-card";
import { IJoinGameAction } from "./models/actions/join-game";
import { IMakeBidAction } from "./models/actions/make-bid";
import { IMessageAction } from "./models/actions/message";
import { IPassAction } from "./models/actions/pass";
import { IPlaceCardAction } from "./models/actions/place-card";
import { IQuitGameAction } from "./models/actions/quit-game";
import { IStartBiddingAction } from "./models/actions/start-bidding";
import { IStartGameAction } from "./models/actions/start-game";

export interface IActionDocumentTypeModelMap {
    CREATE_GAME: ICreateGameAction;
    END_GAME: IEndGameAction;
    END_ROUND: IEndRoundAction;
    EXPIRE_GAME: IExpireGameAction;
    FLIP_CARD: IFlipCardAction;
    JOIN_GAME: IJoinGameAction;
    MAKE_BID: IMakeBidAction;
    MESSAGE: IMessageAction;
    PASS: IPassAction;
    PLACE_CARD: IPlaceCardAction;
    QUIT_GAME: IQuitGameAction;
    START_BIDDING: IStartBiddingAction;
    START_GAME: IStartGameAction;
    START_NEW_ROUND: IStartGameAction;
}