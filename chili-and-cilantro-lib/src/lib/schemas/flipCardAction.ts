import { Schema } from "mongoose";
import { IFlipCardDetails } from "../interfaces/flipCardDetails";
import ModelName from "../enumerations/modelName";

export const FlipCardActionSchema = new Schema<IFlipCardDetails>(
  {
    chef: { type: Schema.Types.ObjectId, ref: ModelName.Chef, required: true },
    card: { type: Schema.Types.ObjectId, required: true },
    cardIndex: { type: Number, required: true },
  });