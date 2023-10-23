import { Schema } from "mongoose";
import { IAction } from "../interfaces/action";
import { Action } from "../enumerations/action";
import ModelName from "../enumerations/modelName";

export const ActionSchema = new Schema<IAction>(
  {
    player: { type: Schema.Types.ObjectId, required: true, ref: ModelName.Player },
    type: { type: String, enum: Object.values(Action), required: true },
    details: { type: Object, required: true },
  },
  {
    timestamps: true,
  });