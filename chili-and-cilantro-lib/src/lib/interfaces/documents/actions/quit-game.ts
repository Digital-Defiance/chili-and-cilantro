import { IQuitGameAction } from '../../models/actions/quit-game';
import { IBaseDocument } from '../base';

export interface IQuitGameActionDocument
  extends IQuitGameAction,
    IBaseDocument<IQuitGameAction> {}
