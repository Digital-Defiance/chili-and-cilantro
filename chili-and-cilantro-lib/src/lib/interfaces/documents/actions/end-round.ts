import { IEndRoundAction } from '../../models/actions/end-round';
import { IActionDocument } from '../action';

export interface IEndRoundActionDocument
  extends IActionDocument,
    IEndRoundAction {}
