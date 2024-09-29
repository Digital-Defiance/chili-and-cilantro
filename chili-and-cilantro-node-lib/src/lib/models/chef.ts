import { IChefDocument } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Connection, Model } from 'mongoose';
import { Schema } from '../schema';

export const ChefModel = (connection: Connection): Model<IChefDocument> =>
  connection.model<IChefDocument>(
    Schema.Chef.name,
    Schema.Chef.schema,
    Schema.Chef.collection,
  );

export default ChefModel;
