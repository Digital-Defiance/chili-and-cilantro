import {
  ICreateGameActionDocument,
  ICreateGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const CreateGameDetailsSchema = new Schema<ICreateGameDetails>(
  {},
  { _id: false },
);

export const CreateGameActionSchema = new Schema<ICreateGameActionDocument>({
  ...ActionSchemaBase,
  details: { type: CreateGameDetailsSchema, required: true },
});
