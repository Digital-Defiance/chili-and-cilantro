import { Model, Schema } from 'mongoose';
import validator from 'validator';
import { IUser } from '../interfaces/user';
import { IGame } from '../interfaces/game';
import { IHasID } from '../interfaces/hasId';
import ModelName from '../enumerations/modelName';

export const GameSchema = new Schema<IGame>({
  name: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9\ ]+$/, // Alphanumeric validation
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  players: [{ type: Schema.Types.ObjectId, ref: ModelName.User }],
  maxPlayers: { type: Number, default: 4 },
}, { timestamps: true });