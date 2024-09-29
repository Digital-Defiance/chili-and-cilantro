import { DefaultIdType } from '../../../shared-types';
import { IAction } from '../action';
import { IMessageDetails } from './details/message';

export type IMessageAction<I = DefaultIdType> = IAction<I, IMessageDetails>;
