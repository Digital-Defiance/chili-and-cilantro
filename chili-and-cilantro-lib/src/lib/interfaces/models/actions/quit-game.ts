import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IQuitGameDetails } from './details/quit-game';

export type IQuitGameAction<I = DefaultIdType> = IAction<I, IQuitGameDetails>;
