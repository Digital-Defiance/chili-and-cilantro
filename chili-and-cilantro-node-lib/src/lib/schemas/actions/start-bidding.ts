import {
  IStartBiddingActionDocument,
  IStartBiddingDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const StartBiddingDetailsSchema = new Schema<IStartBiddingDetails>(
  {
    bid: { type: Number, required: true },
  },
  { _id: false },
);

export const StartBiddingActionSchema = new Schema<IStartBiddingActionDocument>(
  {
    ...ActionSchemaBase,
    details: { type: StartBiddingDetailsSchema, required: true },
  },
);
