import { DefaultIdType } from '../../../shared-types';
import { IStartGameDetails } from '../../models/actions/details/start-game';
import { IStartGameAction } from '../../models/actions/start-game';
import { IActionDocument } from '../action';

export interface IStartGameActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IStartGameDetails<I>>,
    IStartGameAction<I> {}
