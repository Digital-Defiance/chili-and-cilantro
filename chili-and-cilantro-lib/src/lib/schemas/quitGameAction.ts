import { Schema } from "mongoose";
import { IQuitGameDetails } from "../interfaces/quitGameDetails";
import { QuitGameReason } from "../enumerations/quitGameReason";

export const QuitGameActionSchema = new Schema<IQuitGameDetails>(
  {
    reason: { type: String, enum: Object.values(QuitGameReason), required: true }
  });