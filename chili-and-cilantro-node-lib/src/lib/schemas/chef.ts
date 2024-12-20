import {
  CardType,
  ChefState,
  constants,
  ICardDocument,
  IChefDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema, ValidatorProps } from 'mongoose';
import validator from 'validator';

export const CardSchema = new Schema<ICardDocument>(
  {
    type: { type: String, enum: Object.values(CardType), required: true },
    faceUp: { type: Boolean, required: true },
  },
  { _id: false },
);

export const ChefSchema = new Schema<IChefDocument>(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelName.Game,
    },
    name: {
      type: String,
      required: [true, 'Chef name field is required'],
      validate: {
        validator: function (v: string) {
          return (
            v !== undefined &&
            validator.matches(v, constants.MULTILINGUAL_STRING_REGEX) &&
            v.length >= constants.MIN_USER_DISPLAY_NAME_LENGTH &&
            v.length <= constants.MAX_USER_DISPLAY_NAME_LENGTH
          );
        },
        message: (props: ValidatorProps) =>
          `${props.value} is not a valid chef name!`,
      },
      set: (v: string) => (v || '').trim(),
    },
    hand: [CardSchema],
    placedCards: [CardSchema],
    lostCards: {
      type: [String],
      enum: Object.values(CardType),
      required: true,
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ModelName.User,
    },
    state: { type: String, enum: Object.values(ChefState), required: true },
    masterChef: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

// Add a compound index for gameId and name to ensure uniqueness within a game
ChefSchema.index({ gameId: 1, name: 1 }, { unique: true });
