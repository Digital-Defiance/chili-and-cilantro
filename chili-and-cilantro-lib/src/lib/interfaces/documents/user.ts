import { IUser } from '../models/user';
import { IBaseDocument } from './base';

export interface IUserDocument extends IUser, IBaseDocument<IUser> {}
