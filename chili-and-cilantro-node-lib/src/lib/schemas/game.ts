import {
  GamePhase,
  IBid,
  IGameDocument,
  IRoundBids,
  ModelName,
  StringNames,
  constants,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import mongoose, { ValidatorProps } from 'mongoose';
import validator from 'validator';

const { Schema } = mongoose;

export const BidSchema = new Schema<IBid>({
  chefId: {
    type: Schema.Types.ObjectId,
    ref: ModelName.Chef,
    required: true,
  },
  bid: {
    type: Number,
    required: true,
  },
  pass: {
    type: Boolean,
    required: true,
  },
});

export const RoundBidSchema = new Schema<IRoundBids>({
  bids: [BidSchema],
});

export const GameSchema = new Schema<IGameDocument>(
  {
    code: {
      type: String,
      required: [true, translate(StringNames.Validation_Required)],
      validate: {
        validator: function (v: string) {
          return (
            v !== undefined &&
            validator.matches(v, constants.GAME_CODE_REGEX) &&
            v.length == constants.GAME_CODE_LENGTH
          );
        },
        message: (props: ValidatorProps) =>
          translate(StringNames.Validation_InvalidGameCode),
      },
      set: (v: string) => (v || '').trim().toUpperCase(),
    },
    name: {
      type: String,
      required: [true, translate(StringNames.Validation_Required)],
      validate: {
        validator: function (v: string) {
          return (
            v !== undefined &&
            validator.matches(v, constants.GAME_NAME_REGEX) &&
            v.length >= constants.MIN_GAME_NAME_LENGTH &&
            v.length <= constants.MAX_GAME_NAME_LENGTH
          );
        },
        message: (props: ValidatorProps) =>
          translate(StringNames.Validation_GameNameRegexErrorTemplate),
      },
      set: (v: string) => (v || '').trim(),
    },
    password: {
      type: String,
      required: false,
      validate: {
        validator: function (v: string) {
          return (
            v !== undefined &&
            validator.matches(v, constants.GAME_PASSWORD_REGEX) &&
            v.length >= constants.MIN_GAME_PASSWORD_LENGTH &&
            v.length <= constants.MAX_GAME_PASSWORD_LENGTH
          );
        },
        message: (props: ValidatorProps) =>
          translate(StringNames.Validation_GamePasswordRegexErrorTemplate),
      },
      set: (v: string) => (v || '').trim(),
    },
    chefIds: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Chef,
        required: true,
      },
    ],
    eliminatedChefIds: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Chef,
        required: true,
      },
    ],
    maxChefs: {
      type: Number,
      required: true,
      validate: {
        validator: function (v: number) {
          return v >= constants.MIN_CHEFS && v <= constants.MAX_CHEFS;
        },
        message: (props: ValidatorProps) =>
          translate(
            StringNames.Validation_InvalidMaxChefsValueTemplate,
            undefined,
            {
              VALUE: props.value,
            },
          ),
      },
    },
    cardsPlaced: {
      type: Number,
      required: true,
    },
    currentBid: {
      type: Number,
      required: true,
    },
    currentChef: {
      type: Number,
      required: true,
    },
    currentPhase: {
      type: String,
      enum: Object.values(GamePhase),
      required: true,
    },
    currentRound: {
      type: Number,
      required: true,
    },
    roundBids: {
      type: Map,
      of: [BidSchema],
      required: true,
    },
    roundWinners: {
      type: Map,
      of: {
        type: Schema.Types.ObjectId,
        ref: ModelName.Chef,
      },
      required: true,
    },
    turnOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Chef,
        required: true,
      },
    ],
    masterChefId: {
      type: Schema.Types.ObjectId,
      ref: ModelName.Chef,
      required: true,
    },
    masterChefUserId: {
      type: Schema.Types.ObjectId,
      ref: ModelName.User,
      required: true,
    },
    lastGame: {
      type: Schema.Types.ObjectId,
      ref: ModelName.Game,
      required: false,
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: ModelName.Chef,
      required: false,
    },
    dateStarted: {
      type: Date,
      required: false,
    },
    dateEnded: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: ModelName.User,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: ModelName.User,
      required: true,
    },
  },
  {
    timestamps: true, // This will provide createdAt and updatedAt fields automatically
  },
);
