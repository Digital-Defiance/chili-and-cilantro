import { DefaultIdType } from '../../../shared-types';
import { IExpireGameDetails } from '../../models/actions/details/expire-game';
import { IExpireGameAction } from '../../models/actions/expire-game';
import { IActionDocument } from '../action';

export interface IExpireGameActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IExpireGameDetails>,
    IExpireGameAction<I> {}
