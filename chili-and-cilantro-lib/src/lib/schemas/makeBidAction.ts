import { Schema } from "mongoose";
import { IMakeBidDetails } from "../interfaces/makeBidDetails";

export const MakeBidActionSchema = new Schema<IMakeBidDetails>(
  {
    bidNumber: { type: Number, required: true },
  });