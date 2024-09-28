import { DefaultIdType } from '../../shared-types';
import { IUser } from '../models/user';
import { IBaseDocument } from './base';

export interface IUserDocument<I = DefaultIdType>
  extends IBaseDocument<IUser, I>,
    IUser {}
