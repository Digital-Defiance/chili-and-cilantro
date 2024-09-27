import { IStartGameAction } from "../../models/actions/start-game";
import { IBaseDocument } from "../base";

export interface IStartGameActionDocument extends IStartGameAction, IBaseDocument<IStartGameAction> {};