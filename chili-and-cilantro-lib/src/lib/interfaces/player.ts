import { Schema } from "mongoose";
import { IUser } from "./user";

export interface IPlayer extends IUser {
  gameId: Schema.Types.ObjectId;
  hand: Schema.Types.ObjectId[];
}