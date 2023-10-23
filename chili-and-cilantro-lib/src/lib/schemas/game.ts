import mongoose from 'mongoose';
import { GamePhase } from '../enumerations/gamePhase';
import ModelName from '../enumerations/modelName';

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
  }],
  chefs: [{
    type: Schema.Types.ObjectId,
    ref: ModelName.Chef,
    required: true,
  }],
  maxChefs: {
    type: Number,
    required: true,
  },
  currentTurn: {
    type: Schema.Types.ObjectId,
    ref: ModelName.Chef,
    required: true,
  },
  currentPhase: {
    type: String,
    enum: Object.values(GamePhase),
    required: true,
  },
  firstChef: {
    type: Schema.Types.ObjectId,
    ref: ModelName.Chef,
    required: true,
  },
  roundHistory: [{
    type: Schema.Types.ObjectId,
    ref: ModelName.Action,
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: ModelName.User,
    required: true,
  },
}, {
  timestamps: true, // This will provide createdAt and updatedAt fields automatically
});