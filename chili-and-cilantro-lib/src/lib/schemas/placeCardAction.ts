import { Schema } from "mongoose";
import { IPlaceCardDetails } from "../interfaces/placeCardDetails";
import { CardType } from "../enumerations/cardType";
import { IPlaceCardAction } from "../interfaces/placeCardAction";

export const PlaceCardDetailsSchema = new Schema<IPlaceCardDetails>({
  cardType: { type: String, enum: Object.values(CardType), required: true },
  position: { type: Number, required: true },
}, { _id: false });

export const PlaceCardActionSchema = new Schema<IPlaceCardAction>(
  {
    details: { type: PlaceCardDetailsSchema, required: true },
  });