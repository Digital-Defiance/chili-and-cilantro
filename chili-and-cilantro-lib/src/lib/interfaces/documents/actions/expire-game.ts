import { IExpireGameAction } from "../../models/actions/expire-game";
import { IBaseDocument } from "../base";

export interface IExpireGameActionDocument extends IExpireGameAction, IBaseDocument<IExpireGameAction> {}