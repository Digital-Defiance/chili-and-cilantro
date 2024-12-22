import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { ICreateGameDetails } from './details/create-game';

export type ICreateGameAction<I = DefaultIdType> = IAction<
  I,
  ICreateGameDetails<I>
>;
