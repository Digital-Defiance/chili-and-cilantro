import { IActionDocument } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Connection, Model } from 'mongoose';
import { Schema } from '../schema';

export const ActionModel = (connection: Connection): Model<IActionDocument> =>
  connection.model<IActionDocument>(
    Schema.Action.name,
    Schema.Action.schema,
    Schema.Action.collection,
  );

export default ActionModel;
