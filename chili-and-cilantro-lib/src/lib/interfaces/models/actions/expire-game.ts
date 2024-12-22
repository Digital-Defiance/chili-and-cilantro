import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IExpireGameDetails } from './details/expire-game';

export type IExpireGameAction<I = DefaultIdType> = IAction<
  I,
  IExpireGameDetails<I>
>;
