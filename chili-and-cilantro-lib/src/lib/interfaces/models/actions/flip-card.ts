import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IFlipCardDetails } from './details/flip-card';

export type IFlipCardAction<I = DefaultIdType> = IAction<I, IFlipCardDetails>;
