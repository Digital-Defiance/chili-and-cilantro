import { DefaultIdType } from '../../../shared-types';
import { IStartNewRoundDetails } from '../../models/actions/details/start-new-round';
import { IStartNewRoundAction } from '../../models/actions/start-new-round';
import { IActionDocument } from '../action';

export interface IStartNewRoundActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IStartNewRoundDetails>,
    IStartNewRoundAction<I> {}
