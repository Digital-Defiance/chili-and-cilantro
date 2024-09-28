import {
  IJoinGameActionDocument,
  IJoinGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const JoinGameDetailsSchema = new Schema<IJoinGameDetails>(
  {},
  { _id: false },
);

export const JoinGameActionSchema = new Schema<IJoinGameActionDocument>({
  details: { type: JoinGameDetailsSchema, required: true },
});
