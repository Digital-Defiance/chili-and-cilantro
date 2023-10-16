import mongoose, { connect, set } from 'mongoose';
import { environment } from './environment';
import {
  ISchemaModels,
  SchemaModels,
} from '@chili-and-cilantro/chili-and-cilantro-lib';

export async function setupDatabase(): Promise<{
  db: mongoose.Mongoose;
  schema: ISchemaModels;
}> {
  set('strictQuery', true);
  const db = await connect(environment.mongo.uri, {
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    waitQueueTimeoutMS: 30000,
  });
  return { db, schema: SchemaModels };
}
