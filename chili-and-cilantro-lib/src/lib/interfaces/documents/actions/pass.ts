import { IPassAction } from '../../models/actions/pass';
import { IBaseDocument } from '../base';

export interface IPassActionDocument
  extends IPassAction,
    IBaseDocument<IPassAction> {}
