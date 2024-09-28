import {
  CardType,
  IPlaceCardActionDocument,
  IPlaceCardDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const PlaceCardDetailsSchema = new Schema<IPlaceCardDetails>(
  {
    cardType: { type: String, enum: Object.values(CardType), required: true },
    position: { type: Number, required: true },
  },
  { _id: false },
);

export const PlaceCardActionSchema = new Schema<IPlaceCardActionDocument>({
  details: { type: PlaceCardDetailsSchema, required: true },
});
