import { Schema } from "mongoose";
import { IChef } from "../interfaces/chef";
import ModelName from "../enumerations/modelName";
import { ICard } from "../interfaces/card";
import { CardType } from "../enumerations/cardType";
import { ChefState } from "../enumerations/chefState";

export const CardSchema = new Schema<ICard>({
  type: { type: String, enum: Object.values(CardType), required: true },
  faceUp: { type: Boolean, required: true },
}, { _id: false });

export const ChefSchema = new Schema<IChef>({
  gameId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.Game },
  hand: [CardSchema],
  userId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.User },
  state: { type: String, enum: Object.values(ChefState), required: true },
  host: { type: Boolean, required: true, default: false },
}, { timestamps: true })