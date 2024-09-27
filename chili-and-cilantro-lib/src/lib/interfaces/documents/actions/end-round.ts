import { IEndRoundAction } from "../../models/actions/end-round";
import { IBaseDocument } from "../base";

export interface IEndRoundActionDocument extends IEndRoundAction, IBaseDocument<IEndRoundAction> {};