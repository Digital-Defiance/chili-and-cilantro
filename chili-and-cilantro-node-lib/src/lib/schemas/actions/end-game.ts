import {
  IEndGameActionDocument,
  IEndGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const EndGameDetailsSchema = new Schema<IEndGameDetails>(
  {},
  { _id: false },
);

export const EndGameActionSchema = new Schema<IEndGameActionDocument>({
  details: { type: EndGameDetailsSchema, required: true },
});
