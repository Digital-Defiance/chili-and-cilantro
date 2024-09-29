import {
  IFlipCardActionDocument,
  IFlipCardDetails,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const FlipCardDetailsSchema = new Schema<IFlipCardDetails>(
  {
    chef: { type: Schema.Types.ObjectId, ref: ModelName.Chef, required: true },
    card: { type: Schema.Types.ObjectId, required: true },
    cardIndex: { type: Number, required: true },
  },
  { _id: false },
);

export const FlipCardActionSchema = new Schema<IFlipCardActionDocument>({
  ...ActionSchemaBase,
  details: { type: FlipCardDetailsSchema, required: true },
});
