import { Schema } from "mongoose";
import { IHasID } from "./hasId";
import { IHasTimestamps } from "./hasTimestamps";
import { IAction } from "./action";
import { GamePhase } from "../enumerations/gamePhase";

export interface IGame extends IHasID, IHasTimestamps {
  name: string;
  password: string;
  eliminatedPlayers: Schema.Types.ObjectId[];
  players: Schema.Types.ObjectId[];
  maxPlayers: number;
  currentTurn: Schema.Types.ObjectId;
  currentPhase: GamePhase;
  firstPlayer: Schema.Types.ObjectId;
  roundHistory: IAction[];
  owner: Schema.Types.ObjectId;
}