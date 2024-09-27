import { Schema } from 'mongoose';
import { IMessageActionDocument, IMessageDetails } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const MessageDetailsSchema = new Schema<IMessageDetails>(
  {
    message: { type: String, required: true },
  },
  { _id: false },
);

export const MessageActionSchema = new Schema<IMessageActionDocument>({
  details: { type: MessageDetailsSchema, required: true },
});
