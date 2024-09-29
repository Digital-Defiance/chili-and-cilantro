import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IMakeBidDetails } from './details/make-bid';

export type IMakeBidAction<I = DefaultIdType> = IAction<I, IMakeBidDetails>;
