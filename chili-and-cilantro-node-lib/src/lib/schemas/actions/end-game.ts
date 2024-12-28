import {
  EndGameReason,
  IEndGameActionDocument,
  IEndGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const EndGameDetailsSchema = new Schema<IEndGameDetails>(
  {
    reason: {
      type: String,
      required: true,
      enum: Object.values(EndGameReason),
    },
  },
  { _id: false },
);

export const EndGameActionSchema = new Schema<IEndGameActionDocument>({
  ...ActionSchemaBase,
  details: { type: EndGameDetailsSchema, required: true },
});
