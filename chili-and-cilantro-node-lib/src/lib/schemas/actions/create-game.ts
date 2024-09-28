import {
  ICreateGameActionDocument,
  ICreateGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const CreateGameDetailsSchema = new Schema<ICreateGameDetails>(
  {},
  { _id: false },
);

export const CreateGameActionSchema = new Schema<ICreateGameActionDocument>({
  details: { type: CreateGameDetailsSchema, required: true },
});
