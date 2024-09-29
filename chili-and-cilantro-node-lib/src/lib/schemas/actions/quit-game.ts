import {
  IQuitGameActionDocument,
  IQuitGameDetails,
  QuitGameReason,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const QuitGameDetailsSchema = new Schema<IQuitGameDetails>(
  {
    reason: {
      type: String,
      enum: Object.values(QuitGameReason),
      required: true,
    },
  },
  { _id: false },
);

export const QuitGameActionSchema = new Schema<IQuitGameActionDocument>({
  ...ActionSchemaBase,
  details: { type: QuitGameDetailsSchema, required: true },
});
