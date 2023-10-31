import { Schema } from "mongoose";
import { IHasID } from "./hasId";
import { IHasTimestamps } from "./hasTimestamps";
import { IAction } from "./action";
import { FirstChef } from '../enumerations/firstChef';
import { GamePhase } from "../enumerations/gamePhase";

export interface IGame extends IHasID, IHasTimestamps {
  code: string;
  name: string;
  password: string;
  eliminatedChefs: Schema.Types.ObjectId[];
  chefIds: Schema.Types.ObjectId[];
  maxChefs: number;
  currentChef: number;
  currentPhase: GamePhase;
  firstChef: FirstChef;
  turnOrder: Schema.Types.ObjectId[];
  roundHistory: IAction[];
  hostChefId: Schema.Types.ObjectId;
  hostUserId: Schema.Types.ObjectId;
  lastGame?: Schema.Types.ObjectId;
  highestBidder?: Schema.Types.ObjectId;
  winner?: Schema.Types.ObjectId;
}