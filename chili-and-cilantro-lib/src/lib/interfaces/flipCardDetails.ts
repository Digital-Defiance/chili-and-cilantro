import { Schema } from "mongoose";

export interface IFlipCardDetails {
  player: Schema.Types.ObjectId;
  card: Schema.Types.ObjectId;
  cardIndex: number;
}