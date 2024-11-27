import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { SchemaMap } from 'chili-and-cilantro-node-lib/src/types/shared-types';
import mongoose from 'mongoose';

export interface IApplication {
  get db(): typeof mongoose;
  get ready(): boolean;
  start(): Promise<void>;
  getModel: GetModelFunction;
  get schemaMap(): SchemaMap;
}
