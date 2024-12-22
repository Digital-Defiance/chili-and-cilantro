import { DefaultIdType } from '../../../../shared-types';
import { IActionDetailsBase } from './base';

export interface IFlipCardDetails<I = DefaultIdType>
  extends IActionDetailsBase<I> {
  chef: I;
  card: I;
  cardIndex: number;
}
