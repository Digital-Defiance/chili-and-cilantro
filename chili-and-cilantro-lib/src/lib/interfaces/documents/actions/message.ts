import { DefaultIdType } from '../../../shared-types';
import { IMessageDetails } from '../../models/actions/details/message';
import { IMessageAction } from '../../models/actions/message';
import { IActionDocument } from '../action';

export interface IMessageActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IMessageDetails<I>>,
    IMessageAction<I> {}
