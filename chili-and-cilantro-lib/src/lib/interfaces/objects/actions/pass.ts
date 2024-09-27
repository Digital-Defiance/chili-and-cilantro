import { IHasID } from "../../has-id";
import { IPassAction } from "../../models/actions/pass";

export interface IPassActionObject extends IPassAction, IHasID {};