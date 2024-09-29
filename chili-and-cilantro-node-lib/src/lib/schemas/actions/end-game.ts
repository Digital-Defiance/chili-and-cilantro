import {
  IEndGameActionDocument,
  IEndGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const EndGameDetailsSchema = new Schema<IEndGameDetails>(
  {},
  { _id: false },
);

export const EndGameActionSchema = new Schema<IEndGameActionDocument>({
  ...ActionSchemaBase,
  details: { type: EndGameDetailsSchema, required: true },
});
