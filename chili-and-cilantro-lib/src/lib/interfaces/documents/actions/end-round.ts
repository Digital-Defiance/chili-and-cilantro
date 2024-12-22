import { DefaultIdType } from '../../../shared-types';
import { IEndRoundAction } from '../../models/actions/end-round';
import { IActionDocument } from '../action';

export interface IEndRoundActionDocument<I = DefaultIdType>
  extends IActionDocument<I>,
    IEndRoundAction<I> {}
