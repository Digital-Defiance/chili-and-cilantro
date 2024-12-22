import { IHasID } from '../has-id';
import { IAction } from '../models/action';
import { IActionDetailsBase } from '../models/actions/details/base';

export interface IActionObject<
  I = string,
  D extends IActionDetailsBase = IActionDetailsBase,
> extends IAction<I, D>,
    IHasID<I> {}
