import { Schema } from "mongoose";
import { IPlaceCardDetails } from "../interfaces/placeCardDetails";
import { CardType } from "../enumerations/cardType";

export const PlaceCardActionSchema = new Schema<IPlaceCardDetails>(
  {
    cardType: { type: String, enum: Object.values(CardType), required: true },
    position: { type: Number, required: true },
  });