import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IJoinGameDetails } from './details/join-game';

export type IJoinGameAction<I = DefaultIdType> = IAction<
  I,
  IJoinGameDetails<I>
>;
