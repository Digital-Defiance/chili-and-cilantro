import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IMessageDetails } from '../../models/actions/details/message';
import { IMessageAction } from '../../models/actions/message';
import { IActionDocument } from '../action';

export interface IMessageActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IMessageDetails>,
    IMessageAction<I> {}
