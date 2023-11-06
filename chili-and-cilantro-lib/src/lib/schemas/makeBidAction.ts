import { Schema } from "mongoose";
import { IMakeBidDetails } from "../interfaces/makeBidDetails";
import { IMakeBidAction } from "../interfaces/makeBidAction";

export const MakeBidDetailsSchema = new Schema<IMakeBidDetails>({
  bidNumber: { type: Number, required: true },
}, { _id: false });

export const MakeBidActionSchema = new Schema<IMakeBidAction>(
  {
    details: { type: MakeBidDetailsSchema, required: true },
  });