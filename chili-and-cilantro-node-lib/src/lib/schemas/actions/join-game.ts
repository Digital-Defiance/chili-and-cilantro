import { Schema } from 'mongoose';
import { IJoinGameActionDocument, IJoinGameDetails } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const JoinGameDetailsSchema = new Schema<IJoinGameDetails>(
  {},
  { _id: false },
);

export const JoinGameActionSchema = new Schema<IJoinGameActionDocument>({
  details: { type: JoinGameDetailsSchema, required: true },
});
