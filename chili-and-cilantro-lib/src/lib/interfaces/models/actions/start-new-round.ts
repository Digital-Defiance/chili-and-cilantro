import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IStartNewRoundDetails } from './details/start-new-round';

export type IStartNewRoundAction<I = DefaultIdType> = IAction<
  I,
  IStartNewRoundDetails<I>
>;
