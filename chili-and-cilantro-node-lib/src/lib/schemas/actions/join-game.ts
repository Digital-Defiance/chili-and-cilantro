import {
  IJoinGameActionDocument,
  IJoinGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const JoinGameDetailsSchema = new Schema<IJoinGameDetails>(
  {},
  { _id: false },
);

export const JoinGameActionSchema = new Schema<IJoinGameActionDocument>({
  ...ActionSchemaBase,
  details: { type: JoinGameDetailsSchema, required: true },
});
