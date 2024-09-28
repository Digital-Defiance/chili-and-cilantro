import { IEmailTokenDocument } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { model } from 'mongoose';
import { Schema } from '../schema';

export const EmailTokenModel = model<IEmailTokenDocument>(
  Schema.EmailToken.name,
  Schema.EmailToken.schema,
  Schema.EmailToken.collection,
);
