import { IFlipCardAction } from '../../models/actions/flip-card';
import { IBaseDocument } from '../base';

export interface IFlipCardActionDocument
  extends IFlipCardAction,
    IBaseDocument<IFlipCardAction> {}
