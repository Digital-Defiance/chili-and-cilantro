import { Types } from 'mongoose';
import { IHasID } from '../has-id';
import { IAction } from '../models/action';
import { IActionDetailsBase } from '../models/actions/details/base';

export interface IActionObject<
  I = Types.ObjectId,
  D extends IActionDetailsBase = IActionDetailsBase,
> extends IAction<I, D>,
    IHasID {}
