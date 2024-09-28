import { Document, Types } from 'mongoose';

export interface IBaseDocument<T>
  extends Document<Types.ObjectId, unknown, T> {}
