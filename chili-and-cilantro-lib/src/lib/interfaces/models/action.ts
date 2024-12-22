import { ActionType } from '../../enumerations/action-type';
import { DefaultIdType } from '../../shared-types';
import { IHasTimestamps } from '../has-timestamps';
import { IActionDetailsBase } from './actions/details/base';

export interface IAction<
  I = DefaultIdType,
  D extends IActionDetailsBase<I> = IActionDetailsBase<I>,
> extends IHasTimestamps {
  gameId: I;
  chefId: I;
  userId: I;
  type: ActionType;
  details: D;
  round: number;
}
