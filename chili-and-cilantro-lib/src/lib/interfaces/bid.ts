import { Schema } from "mongoose";

export interface IBid {
  chefId: Schema.Types.ObjectId;
  bid: number;
}