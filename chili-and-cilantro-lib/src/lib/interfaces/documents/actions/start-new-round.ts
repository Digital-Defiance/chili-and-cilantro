import { IStartNewRoundAction } from '../../models/actions/start-new-round';
import { IBaseDocument } from '../base';

export interface IStartNewRoundActionDocument
  extends IStartNewRoundAction,
    IBaseDocument<IStartNewRoundAction> {}
