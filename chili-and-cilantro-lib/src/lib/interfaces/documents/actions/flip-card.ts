import { DefaultIdType } from '../../../shared-types';
import { IFlipCardDetails } from '../../models/actions/details/flip-card';
import { IFlipCardAction } from '../../models/actions/flip-card';
import { IActionDocument } from '../action';

export interface IFlipCardActionDocument<I = DefaultIdType>
  extends IActionDocument<I, IFlipCardDetails>,
    IFlipCardAction<I> {}
