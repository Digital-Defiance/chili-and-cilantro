import { Schema } from "mongoose";
import { IQuitGameDetails } from "../interfaces/quitGameDetails";
import { QuitGameReason } from "../enumerations/quitGameReason";
import { IQuitGameAction } from "../interfaces/quitGameAction";

export const QuitGameDetailsSchema = new Schema<IQuitGameDetails>({
  reason: { type: String, enum: Object.values(QuitGameReason), required: true }
}, { _id: false });

export const QuitGameActionSchema = new Schema<IQuitGameAction>(
  {
    details: { type: QuitGameDetailsSchema, required: true },
  });