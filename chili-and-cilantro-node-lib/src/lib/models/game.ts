import { IGameDocument } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Connection, Model } from 'mongoose';
import { Schema } from '../schema';

export const GameModel = (connection: Connection): Model<IGameDocument> =>
  connection.model<IGameDocument>(
    Schema.Game.name,
    Schema.Game.schema,
    Schema.Game.collection,
  );

export default GameModel;
