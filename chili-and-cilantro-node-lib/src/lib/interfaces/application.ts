import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-lib';
import mongoose from 'mongoose';
import { SchemaMap } from '../shared-types';

export interface IApplication {
  get db(): typeof mongoose;
  get ready(): boolean;
  start(mongoUri?: string): Promise<void>;
  getModel: GetModelFunction;
  get schemaMap(): SchemaMap;
  get useTransactions(): boolean;
}
