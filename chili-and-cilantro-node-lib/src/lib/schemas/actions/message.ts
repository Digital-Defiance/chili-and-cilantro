import {
  IMessageActionDocument,
  IMessageDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const MessageDetailsSchema = new Schema<IMessageDetails>(
  {
    message: { type: String, required: true },
  },
  { _id: false },
);

export const MessageActionSchema = new Schema<IMessageActionDocument>({
  ...ActionSchemaBase,
  details: { type: MessageDetailsSchema, required: true },
});
