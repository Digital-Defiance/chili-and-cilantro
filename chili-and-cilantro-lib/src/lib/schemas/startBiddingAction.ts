import { Schema } from "mongoose";
import { IStartBiddingDetails } from "../interfaces/startBiddingDetails";
import { IStartBiddingAction } from "../interfaces/startBiddingAction";

export const StartBiddingDetailsSchema = new Schema<IStartBiddingDetails>({
  bid: { type: Number, required: true },
}, { _id: false });

export const StartBiddingActionSchema = new Schema<IStartBiddingAction>(
  {
    details: { type: StartBiddingDetailsSchema, required: true },
  });