import { Document, Types } from 'mongoose';

export type IBaseDocument<T> = Document<Types.ObjectId, unknown, T>;
