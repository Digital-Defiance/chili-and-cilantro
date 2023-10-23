import mongoose from 'mongoose';
import { GamePhase } from '../enumerations/gamePhase';
import ModelName from '../enumerations/modelName';
import { FirstChef } from '../enumerations/firstChef';

const { Schema } = mongoose;

export const GameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  eliminatedChefs: [{
    type: Schema.Types.ObjectId,
    ref: ModelName.Chef,
    required: true,
  }],
  chefs: [{
    type: Schema.Types.ObjectId,
    ref: ModelName.Chef,
    required: true,
  }],
  firstChef: {
    type: String,
    enum: Object.values(FirstChef),
    required: true,
  },
  maxChefs: {
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
  roundHistory: [{
    type: Schema.Types.ObjectId,
    ref: ModelName.Action,
    required: true,
  }],
  turnOrder: [{
    type: Schema.Types.ObjectId,
    ref: ModelName.Chef,
    required: true,
  }],
  host: {
    type: Schema.Types.ObjectId,
    ref: ModelName.User,
    required: true,
  },
}, {
  timestamps: true, // This will provide createdAt and updatedAt fields automatically
});