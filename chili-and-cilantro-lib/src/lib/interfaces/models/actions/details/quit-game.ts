import { QuitGameReason } from '../../../../enumerations/quit-game-reason';
import { IActionDetailsBase } from './base';

export interface IQuitGameDetails extends IActionDetailsBase {
  reason: QuitGameReason;
}
