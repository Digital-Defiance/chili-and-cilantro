import mongoose from 'mongoose';
import { GetModelFunction } from '../types/types';

export interface IApplication {
  get db(): typeof mongoose;
  get ready(): boolean;
  start(): Promise<void>;
  getModel: GetModelFunction;
}
