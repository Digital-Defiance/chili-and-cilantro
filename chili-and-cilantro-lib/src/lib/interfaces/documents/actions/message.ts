import { IMessageAction } from '../../models/actions/message';
import { IBaseDocument } from '../base';

export interface IMessageActionDocument
  extends IMessageAction,
    IBaseDocument<IMessageAction> {}
