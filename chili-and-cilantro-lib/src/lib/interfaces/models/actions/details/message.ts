import { DefaultIdType } from '../../../../shared-types';
import { IActionDetailsBase } from './base';

export interface IMessageDetails<I = DefaultIdType>
  extends IActionDetailsBase<I> {
  message: string;
}
