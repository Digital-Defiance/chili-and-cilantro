import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IStartGameDetails } from '../../models/actions/details/start-game';
import { IStartGameAction } from '../../models/actions/start-game';
import { IActionDocument } from '../action';

export interface IStartGameActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IStartGameDetails>,
    IStartGameAction<I> {}
