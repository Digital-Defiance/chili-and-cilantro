import { Schema } from "mongoose";
import { Action } from "../enumerations/action";
import { IHasID } from "./hasId";

export interface IAction extends IHasID {
  player: Schema.Types.ObjectId;
  type: Action;
  details: object;
}