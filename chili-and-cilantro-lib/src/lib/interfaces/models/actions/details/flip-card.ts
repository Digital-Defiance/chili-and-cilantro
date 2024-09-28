import { DefaultIdType } from '../../../../shared-types';
import { IActionDetailsBase } from './base';

export interface IFlipCardDetails extends IActionDetailsBase {
  chef: DefaultIdType;
  card: DefaultIdType;
  cardIndex: number;
}
