import { DefaultIdType } from '../../../shared-types';
import { IQuitGameDetails } from '../../models/actions/details/quit-game';
import { IQuitGameAction } from '../../models/actions/quit-game';
import { IActionDocument } from '../action';

export interface IQuitGameActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IQuitGameDetails<I>>,
    IQuitGameAction<I> {}
