import mongoose from 'mongoose';
import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { GamePhase } from '../enumerations/gamePhase';
import ModelName from '../enumerations/modelName';
import { FirstChef } from '../enumerations/firstChef';
import { IGame } from '../interfaces/game';
import validator from 'validator';

const { Schema } = mongoose;

export const GameSchema = new Schema<IGame>(
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
          )
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
      required: [true, 'Password field is required'],
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
      set: (v: string) => (v || '').trim().toLowerCase(),
    },
    eliminatedChefs: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Chef,
        required: true,
      },
    ],
    chefIds: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Chef,
        required: true,
      },
    ],
    firstChef: {
      type: String,
      enum: Object.values(FirstChef),
      required: true,
    },
    maxChefs: {
      type: Number,
      required: true,
      validate: {
        validator: function (v: number) {
          return v >= constants.MIN_CHEFS && v <= constants.MAX_CHEFS;
        },
        message: (props) => `${props.value} is not a valid number of chefs!`,
      }
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
    roundHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelName.Action,
        required: true,
      },
    ],
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
    highestBidder: {
      type: Schema.Types.ObjectId,
      ref: ModelName.Chef,
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
  }
);
