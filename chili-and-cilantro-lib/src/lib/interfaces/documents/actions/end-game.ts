import { DefaultIdType } from '../../../shared-types';
import { IEndGameDetails } from '../../models/actions/details/end-game';
import { IEndGameAction } from '../../models/actions/end-game';
import { IActionDocument } from '../action';

export interface IEndGameActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IEndGameDetails>,
    IEndGameAction<I> {}
