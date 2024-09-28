import { CardType } from '../../../../enumerations/card-type';
import { IActionDetailsBase } from './base';

export interface IPlaceCardDetails extends IActionDetailsBase {
  /**
   * The type of card placed, e.g., 'Cilantro' or 'Chili'. This might be hidden from other chefs but known to the game logic to check the results later.
   */
  cardType: CardType;
  /**
   * The position in the chef's deck where the card was placed.
   */
  position: number;
}
