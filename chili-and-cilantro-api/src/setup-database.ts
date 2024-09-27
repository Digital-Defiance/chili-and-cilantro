import {
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import mongoose, { connect, set } from 'mongoose';
import { environment } from './environment';
import { ISchemaModelData } from 'chili-and-cilantro-node-lib/src/lib/interfaces/schema-model-data';
import { Schema } from '@chili-and-cilantro/chili-and-cilantro-node-lib';

export async function setupDatabase(): Promise<{
  db: mongoose.Mongoose;
  schema: Record<ModelName, ISchemaModelData<any>>;
}> {
  set('strictQuery', true);
  const db = await connect(environment.mongo.uri, {
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    waitQueueTimeoutMS: 30000,
  });
  return { db, schema: Schema };
}
