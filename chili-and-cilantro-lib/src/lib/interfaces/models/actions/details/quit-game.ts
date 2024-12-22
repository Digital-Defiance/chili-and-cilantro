import { QuitGameReason } from '../../../../enumerations/quit-game-reason';
import { DefaultIdType } from '../../../../shared-types';
import { IActionDetailsBase } from './base';

export interface IQuitGameDetails<I = DefaultIdType>
  extends IActionDetailsBase<I> {
  reason: QuitGameReason;
}
