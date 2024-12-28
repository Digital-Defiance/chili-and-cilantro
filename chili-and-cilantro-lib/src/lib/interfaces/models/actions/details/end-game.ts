import { EndGameReason } from '../../../../enumerations/end-game-reason';
import { DefaultIdType } from '../../../../shared-types';
import { IActionDetailsBase } from './base';

export interface IEndGameDetails<I = DefaultIdType>
  extends IActionDetailsBase<I> {
  reason: EndGameReason;
}
