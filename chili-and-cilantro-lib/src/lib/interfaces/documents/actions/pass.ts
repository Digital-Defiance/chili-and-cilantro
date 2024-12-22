import { DefaultIdType } from '../../../shared-types';
import { IPassDetails } from '../../models/actions/details/pass';
import { IPassAction } from '../../models/actions/pass';
import { IActionDocument } from '../action';

export interface IPassActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IPassDetails<I>>,
    IPassAction<I> {}
