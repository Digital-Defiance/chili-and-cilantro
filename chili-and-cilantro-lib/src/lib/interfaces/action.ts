import { Schema } from "mongoose";
import { Action } from "../enumerations/action";
import { IHasID } from "./hasId";

export interface IAction extends IHasID {
  gameId: Schema.Types.ObjectId;
  chefId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  type: Action;
  details: object;
}