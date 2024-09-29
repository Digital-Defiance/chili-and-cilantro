import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-lib';
import mongoose from 'mongoose';

export interface IApplication {
  get db(): typeof mongoose;
  get ready(): boolean;
  start(): Promise<void>;
  getModel: GetModelFunction;
}
