import { ActionType } from "./enumerations/action-type";
import { ICreateGameActionDocument } from "./interfaces/documents/actions/create-game";
import { IEndGameActionDocument } from "./interfaces/documents/actions/end-game";
import { IEndRoundActionDocument } from "./interfaces/documents/actions/end-round";
import { IExpireGameActionDocument } from "./interfaces/documents/actions/expire-game";
import { IFlipCardActionDocument } from "./interfaces/documents/actions/flip-card";
import { IJoinGameActionDocument } from "./interfaces/documents/actions/join-game";
import { IMakeBidActionDocument } from "./interfaces/documents/actions/make-bid";
import { IMessageActionDocument } from "./interfaces/documents/actions/message";
import { IPassActionDocument } from "./interfaces/documents/actions/pass";
import { IPlaceCardActionDocument } from "./interfaces/documents/actions/place-card";
import { IQuitGameActionDocument } from "./interfaces/documents/actions/quit-game";
import { IStartBiddingActionDocument } from "./interfaces/documents/actions/start-bidding";
import { IStartGameActionDocument } from "./interfaces/documents/actions/start-game";
import { IStartNewRoundActionDocument } from "./interfaces/documents/actions/start-new-round";

export type ActionDocumentTypes = {
    [ActionType.CREATE_GAME]: ICreateGameActionDocument,
    [ActionType.END_GAME]: IEndGameActionDocument,
    [ActionType.END_ROUND]: IEndRoundActionDocument,
    [ActionType.EXPIRE_GAME]: IExpireGameActionDocument,
    [ActionType.FLIP_CARD]: IFlipCardActionDocument,
    [ActionType.JOIN_GAME]: IJoinGameActionDocument,
    [ActionType.MAKE_BID]: IMakeBidActionDocument,
    [ActionType.MESSAGE]: IMessageActionDocument,
    [ActionType.PASS]: IPassActionDocument,
    [ActionType.PLACE_CARD]: IPlaceCardActionDocument,
    [ActionType.QUIT_GAME]: IQuitGameActionDocument,
    [ActionType.START_BIDDING]: IStartBiddingActionDocument,
    [ActionType.START_GAME]: IStartGameActionDocument,
    [ActionType.START_NEW_ROUND]: IStartNewRoundActionDocument,
};

export const ActionDocumentTypesMap: ActionDocumentTypes = {
    [ActionType.CREATE_GAME]: {} as ICreateGameActionDocument,
    [ActionType.END_GAME]: {} as IEndGameActionDocument,
    [ActionType.END_ROUND]: {} as IEndRoundActionDocument,
    [ActionType.EXPIRE_GAME]: {} as IExpireGameActionDocument,
    [ActionType.FLIP_CARD]: {} as IFlipCardActionDocument,
    [ActionType.JOIN_GAME]: {} as IJoinGameActionDocument,
    [ActionType.MAKE_BID]: {} as IMakeBidActionDocument,
    [ActionType.MESSAGE]: {} as IMessageActionDocument,
    [ActionType.PASS]: {} as IPassActionDocument,
    [ActionType.PLACE_CARD]: {} as IPlaceCardActionDocument,
    [ActionType.QUIT_GAME]: {} as IQuitGameActionDocument,
    [ActionType.START_BIDDING]: {} as IStartBiddingActionDocument,
    [ActionType.START_GAME]: {} as IStartGameActionDocument,
    [ActionType.START_NEW_ROUND]: {} as IStartNewRoundActionDocument,
};