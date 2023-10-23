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
  eliminatedPlayers: [{
    type: Schema.Types.ObjectId,
    ref: ModelName.Player,
  }],
  players: [{
    type: Schema.Types.ObjectId,
    ref: ModelName.Player,
    required: true,
  }],
  maxPlayers: {
    type: Number,
    required: true,
  },
  currentTurn: {
    type: Schema.Types.ObjectId,
    ref: ModelName.Player,
    required: true,
  },
  currentPhase: {
    type: String,
    enum: Object.values(GamePhase),
    required: true,
  },
  firstPlayer: {
    type: Schema.Types.ObjectId,
    ref: ModelName.Player,
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