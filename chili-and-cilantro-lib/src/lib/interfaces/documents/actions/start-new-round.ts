import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IStartNewRoundDetails } from '../../models/actions/details/start-new-round';
import { IStartNewRoundAction } from '../../models/actions/start-new-round';
import { IActionDocument } from '../action';

export interface IStartNewRoundActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IStartNewRoundDetails>,
    IStartNewRoundAction<I> {}
