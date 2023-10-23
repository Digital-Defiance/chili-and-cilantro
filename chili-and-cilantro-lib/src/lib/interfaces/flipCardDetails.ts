import { Schema } from "mongoose";

export interface IFlipCardDetails {
  chef: Schema.Types.ObjectId;
  card: Schema.Types.ObjectId;
  cardIndex: number;
}