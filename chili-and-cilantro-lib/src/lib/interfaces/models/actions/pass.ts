import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IPassDetails } from './details/pass';

export type IPassAction<I = DefaultIdType> = IAction<I, IPassDetails>;
