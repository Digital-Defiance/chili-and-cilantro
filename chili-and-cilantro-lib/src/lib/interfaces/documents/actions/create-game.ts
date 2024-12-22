import { DefaultIdType } from '../../../shared-types';
import { ICreateGameAction } from '../../models/actions/create-game';
import { ICreateGameDetails } from '../../models/actions/details/create-game';
import { IActionDocument } from '../action';

export interface ICreateGameActionDocument<I = DefaultIdType>
  extends IActionDocument<I, ICreateGameDetails<I>>,
    ICreateGameAction<I> {}
