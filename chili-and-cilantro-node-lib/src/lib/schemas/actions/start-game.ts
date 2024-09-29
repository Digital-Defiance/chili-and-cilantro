import {
  IStartGameActionDocument,
  IStartGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const StartGameDetailsSchema = new Schema<IStartGameDetails>(
  {},
  { _id: false },
);

export const StartGameActionSchema = new Schema<IStartGameActionDocument>({
  ...ActionSchemaBase,
  details: { type: StartGameDetailsSchema, required: true },
});
