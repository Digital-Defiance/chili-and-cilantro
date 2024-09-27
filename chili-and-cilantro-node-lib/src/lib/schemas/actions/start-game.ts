import { Schema } from 'mongoose';
import { IStartGameActionDocument, IStartGameDetails } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const StartGameDetailsSchema = new Schema<IStartGameDetails>(
  {},
  { _id: false },
);

export const StartGameActionSchema = new Schema<IStartGameActionDocument>({
  details: { type: StartGameDetailsSchema, required: true },
});
