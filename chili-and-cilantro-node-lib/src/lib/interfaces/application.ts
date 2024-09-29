import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-lib';
import mongoose from 'mongoose';
import { SchemaMap } from '../../types/shared-types';

export interface IApplication {
  get db(): typeof mongoose;
  get ready(): boolean;
  start(): Promise<void>;
  getModel: GetModelFunction;
  get schemaMap(): SchemaMap;
}
