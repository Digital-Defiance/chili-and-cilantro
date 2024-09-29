import { DefaultIdType } from 'chili-and-cilantro-lib/src/lib/shared-types';
import { IActionDetailsBase } from './base';

export interface IFlipCardDetails extends IActionDetailsBase {
  chef: DefaultIdType;
  card: DefaultIdType;
  cardIndex: number;
}
