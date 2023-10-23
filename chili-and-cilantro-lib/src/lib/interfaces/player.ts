import { Schema } from "mongoose";
import { PlayerState } from '../enumerations/playerState';
import { ICard } from "./card";
import { IHasID } from "./hasId";

export interface IPlayer extends IHasID {
  gameId: Schema.Types.ObjectId;
  hand: ICard[];
  userId: Schema.Types.ObjectId;
  state: PlayerState;
  owner: boolean;
}