import { IActionDetailsBase } from './base';

export interface IMakeBidDetails extends IActionDetailsBase {
  /**
   * The number of cards the chef proposes they can flip without hitting a 'CHILI'
   */
  bidNumber: number;
}
