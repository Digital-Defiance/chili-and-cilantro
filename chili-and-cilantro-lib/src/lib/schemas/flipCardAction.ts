import { Schema } from 'mongoose';
import { IFlipCardDetails } from '../interfaces/flipCardDetails';
import ModelName from '../enumerations/modelName';
import { IFlipCardAction } from '../interfaces/flipCardAction';

export const FlipCardDetailsSchema = new Schema<IFlipCardDetails>(
  {
    chef: { type: Schema.Types.ObjectId, ref: ModelName.Chef, required: true },
    card: { type: Schema.Types.ObjectId, required: true },
    cardIndex: { type: Number, required: true },
  },
  { _id: false }
);

export const FlipCardActionSchema = new Schema<IFlipCardAction>({
  details: { type: FlipCardDetailsSchema, required: true },
});
