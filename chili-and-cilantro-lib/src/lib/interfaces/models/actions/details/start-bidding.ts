import { DefaultIdType } from '../../../../shared-types';
import { IActionDetailsBase } from './base';

export interface IStartBiddingDetails<I = DefaultIdType>
  extends IActionDetailsBase<I> {
  bid: number;
}
