import { Schema } from "mongoose";
import { IPassDetails } from "../interfaces/passDetails";
import { IPassAction } from "../interfaces/passAction";

export const PassDetailsSchema = new Schema<IPassDetails>({}, { _id: false });

export const PassActionSchema = new Schema<IPassAction>(
  {
    details: { type: PassDetailsSchema, required: true },
  });