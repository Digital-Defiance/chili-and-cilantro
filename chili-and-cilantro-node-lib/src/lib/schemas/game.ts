import mongoose from 'mongoose';
import validator from 'validator';
import { constants, GamePhase, IBid, IGameDocument, IRoundBids, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';

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
      required: [true, 'Game code field is required'],
      validate: {
        validator: function (v: string) {
          return (
            v !== undefined &&
            validator.matches(v, /[A-Z]+/i) &&
            v.length == constants.GAME_CODE_LENGTH
          );
        },
        message: (props) => `${props.value} is not a valid game code!`,
      },
      set: (v: string) => (v || '').trim().toUpperCase(),
    },
    name: {
      type: String,
      required: [true, 'Game name field is required'],
      validate: {
        validator: function (v: string) {
          return (
            v !== undefined &&
            validator.matches(v, constants.MULTILINGUAL_STRING_REGEX) &&
            v.length >= constants.MIN_GAME_NAME_LENGTH &&
            v.length <= constants.MAX_GAME_NAME_LENGTH
          );
        },
        message: (props) => `${props.value} is not a valid game name!`,
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
            validator.matches(v, constants.MULTILINGUAL_STRING_REGEX) &&
            v.length >= constants.MIN_GAME_PASSWORD_LENGTH &&
            v.length <= constants.MAX_GAME_PASSWORD_LENGTH
          );
        },
        message: (props) => `${props.value} is not a valid password!`,
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
        message: (props) => `${props.value} is not a valid number of chefs!`,
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
        required: true,
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
    hostChefId: {
      type: Schema.Types.ObjectId,
      ref: ModelName.Chef,
      required: true,
    },
    hostUserId: {
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
  },
  {
    timestamps: true, // This will provide createdAt and updatedAt fields automatically
  },
);
