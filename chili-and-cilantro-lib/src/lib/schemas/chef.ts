import { Schema } from "mongoose";
import validator from "validator";
import constants from "../constants";
import { IChef } from "../interfaces/chef";
import ModelName from "../enumerations/modelName";
import { ICard } from "../interfaces/card";
import { CardType } from "../enumerations/cardType";
import { ChefState } from "../enumerations/chefState";

export const CardSchema = new Schema<ICard>({
  type: { type: String, enum: Object.values(CardType), required: true },
  faceUp: { type: Boolean, required: true },
}, { _id: false });

export const ChefSchema = new Schema<IChef>({
  gameId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.Game },
  name: {
    type: String, required: [true, 'Chef name field is required'],
    validate: {
      validator: function (v: string) {
        return (
          v !== undefined &&
          validator.matches(v, constants.MULTILINGUAL_STRING_REGEX) &&
          v.length >= constants.MIN_USER_NAME_LENGTH &&
          v.length <= constants.MAX_USER_NAME_LENGTH
        );
      },
      message: (props) => `${props.value} is not a valid chef name!`,
    },
    set: (v: string) => (v || '').trim(),
  },
  hand: [CardSchema],
  placedCards: [CardSchema],
  userId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.User },
  state: { type: String, enum: Object.values(ChefState), required: true },
  host: { type: Boolean, required: true, default: false },
}, { timestamps: true });

// Add a compound index for gameId and name to ensure uniqueness within a game
ChefSchema.index({ gameId: 1, name: 1 }, { unique: true });