import { DefaultIdType } from '../../../../shared-types';
import { IActionDetailsBase } from './base';

export interface IMakeBidDetails<I = DefaultIdType>
  extends IActionDetailsBase<I> {
  /**
   * The number of cards the chef proposes they can flip without hitting a 'CHILI'
   */
  bidNumber: number;
}
