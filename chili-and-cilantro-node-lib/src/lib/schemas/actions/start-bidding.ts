import { Schema } from 'mongoose';
import { IStartBiddingActionDocument, IStartBiddingDetails } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const StartBiddingDetailsSchema = new Schema<IStartBiddingDetails>(
  {
    bid: { type: Number, required: true },
  },
  { _id: false },
);

export const StartBiddingActionSchema = new Schema<IStartBiddingActionDocument>({
  details: { type: StartBiddingDetailsSchema, required: true },
});
