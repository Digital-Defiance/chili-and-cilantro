import { IJoinGameAction } from "../../models/actions/join-game";
import { IBaseDocument } from "../base";

export interface IJoinGameActionDocument extends IJoinGameAction, IBaseDocument<IJoinGameAction> {}