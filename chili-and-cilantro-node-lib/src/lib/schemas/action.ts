import {
  ActionType,
  IActionDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const ActionSchemaBase = {
  gameId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ModelName.Game,
  },
  chefId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ModelName.Chef,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: ModelName.User,
  },
  type: { type: String, enum: Object.values(ActionType), required: true },
  round: { type: Number, required: true },
};

export const ActionSchema = new Schema<IActionDocument>(
  {
    ...ActionSchemaBase,
    details: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
  },
);
