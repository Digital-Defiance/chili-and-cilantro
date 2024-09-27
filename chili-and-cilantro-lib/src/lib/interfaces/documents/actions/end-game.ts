import { IEndGameAction } from "../../models/actions/end-game";
import { IBaseDocument } from "../base";

export interface IEndGameActionDocument extends IEndGameAction, IBaseDocument<IEndGameAction> {}