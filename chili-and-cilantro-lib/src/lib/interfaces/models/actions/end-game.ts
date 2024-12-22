import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IEndGameDetails } from './details/end-game';

export type IEndGameAction<I = DefaultIdType> = IAction<I, IEndGameDetails<I>>;
