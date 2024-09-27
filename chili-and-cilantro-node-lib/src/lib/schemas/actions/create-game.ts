import { Schema } from 'mongoose';
import { ICreateGameActionDocument, ICreateGameDetails } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const CreateGameDetailsSchema = new Schema<ICreateGameDetails>(
  {},
  { _id: false },
);

export const CreateGameActionSchema = new Schema<ICreateGameActionDocument>({
  details: { type: CreateGameDetailsSchema, required: true },
});
