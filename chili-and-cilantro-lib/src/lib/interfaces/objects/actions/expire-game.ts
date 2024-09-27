import { IHasID } from "../../has-id";
import { IExpireGameAction } from "../../models/actions/expire-game";

export interface IExpireGameActionObject extends IExpireGameAction, IHasID {};