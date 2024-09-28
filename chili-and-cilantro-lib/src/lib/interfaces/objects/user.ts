import { IHasID } from '../has-id';
import { IUser } from '../models/user';

export interface IUserObject extends IUser, IHasID {}
