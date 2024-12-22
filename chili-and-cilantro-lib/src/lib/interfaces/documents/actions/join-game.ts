import { DefaultIdType } from '../../../shared-types';
import { IJoinGameDetails } from '../../models/actions/details/join-game';
import { IJoinGameAction } from '../../models/actions/join-game';
import { IActionDocument } from '../action';

export interface IJoinGameActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IJoinGameDetails<I>>,
    IJoinGameAction<I> {}
