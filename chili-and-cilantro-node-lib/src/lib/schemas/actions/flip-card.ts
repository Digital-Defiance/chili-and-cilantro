import {
  IFlipCardActionDocument,
  IFlipCardDetails,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const FlipCardDetailsSchema = new Schema<IFlipCardDetails>(
  {
    chef: { type: Schema.Types.ObjectId, ref: ModelName.Chef, required: true },
    card: { type: Schema.Types.ObjectId, required: true },
    cardIndex: { type: Number, required: true },
  },
  { _id: false },
);

export const FlipCardActionSchema = new Schema<IFlipCardActionDocument>({
  details: { type: FlipCardDetailsSchema, required: true },
});
