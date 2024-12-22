import { DefaultIdType } from '../../shared-types';
import { IAction } from '../models/action';
import { IActionDetailsBase } from '../models/actions/details/base';
import { IBaseDocument } from './base';

export interface IActionDocument<
  I = DefaultIdType,
  D extends IActionDetailsBase<I> = IActionDetailsBase<I>,
> extends IBaseDocument<IAction<I, D>, I>,
    IAction<I, D> {}
