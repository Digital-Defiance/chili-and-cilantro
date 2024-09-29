import { Document } from 'mongoose';
import { DefaultIdType } from '../../shared-types';

export type IBaseDocument<T, I = DefaultIdType> = Document<I, unknown, T> & T;
