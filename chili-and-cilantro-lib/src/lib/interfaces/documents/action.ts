import { IAction } from '../models/action';
import { IBaseDocument } from './base';

export interface IActionDocument extends IAction, IBaseDocument<IAction> {}
