import { Schema } from "mongoose";
import { IEndRoundAction } from "../interfaces/endRoundAction";
import { IEndRoundDetails } from "../interfaces/endRoundDetails";

export const EndRoundDetailsSchema = new Schema<IEndRoundDetails>({}, { _id: false });

export const EndRoundActionSchema = new Schema<IEndRoundAction>(
  {
    details: { type: EndRoundDetailsSchema, required: true },
  });