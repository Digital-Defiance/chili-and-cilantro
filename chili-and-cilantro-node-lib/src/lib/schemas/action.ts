import { Schema } from 'mongoose';
import { ActionType, IActionDocument, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const ActionSchema = new Schema<IActionDocument>(
  {
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
    details: { type: Object, required: true },
    round: { type: Number, required: true },
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
  },
);
