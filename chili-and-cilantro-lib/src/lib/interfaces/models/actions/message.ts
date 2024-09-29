import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IAction } from '../action';
import { IMessageDetails } from './details/message';

export interface IMessageAction<I = DefaultIdType>
  extends IAction<I, IMessageDetails> {}
