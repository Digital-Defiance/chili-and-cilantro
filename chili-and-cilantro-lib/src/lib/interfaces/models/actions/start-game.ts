import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IStartGameDetails } from './details/start-game';

export type IStartGameAction<I = DefaultIdType> = IAction<I, IStartGameDetails>;
