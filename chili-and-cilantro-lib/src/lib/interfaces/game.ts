import { Schema } from "mongoose";
import { IHasID } from "./hasId";
import { IHasTimestamps } from "./hasTimestamps";
import { IAction } from "./action";
import { GamePhase } from "../enumerations/gamePhase";

export interface IGame extends IHasID, IHasTimestamps {
  name: string;
  password: string;
  eliminatedChefs: Schema.Types.ObjectId[];
  chefs: Schema.Types.ObjectId[];
  maxChefs: number;
  currentTurn: Schema.Types.ObjectId;
  currentPhase: GamePhase;
  firstChef: Schema.Types.ObjectId;
  roundHistory: IAction[];
  owner: Schema.Types.ObjectId;
}