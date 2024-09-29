import { IEmailTokenDocument } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Connection, Model } from 'mongoose';
import { Schema } from '../schema';

export const EmailTokenModel = (
  connection: Connection,
): Model<IEmailTokenDocument> =>
  connection.model<IEmailTokenDocument>(
    Schema.EmailToken.name,
    Schema.EmailToken.schema,
    Schema.EmailToken.collection,
  );
