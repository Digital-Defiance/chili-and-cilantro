import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IEndRoundDetails } from './details/end-round';

export type IEndRoundAction<I = DefaultIdType> = IAction<I, IEndRoundDetails>;
