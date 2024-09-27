import { Schema } from 'mongoose';
import { IEndGameActionDocument, IEndGameDetails } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const EndGameDetailsSchema = new Schema<IEndGameDetails>(
  {},
  { _id: false },
);

export const EndGameActionSchema = new Schema<IEndGameActionDocument>({
  details: { type: EndGameDetailsSchema, required: true },
});
