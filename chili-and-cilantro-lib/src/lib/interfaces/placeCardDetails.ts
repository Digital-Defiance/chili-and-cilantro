import { CardType } from "../enumerations/cardType";

export interface IPlaceCardDetails {
  /**
   * The type of card placed, e.g., 'Cilantro' or 'Chili'. This might be hidden from other players but known to the game logic to check the results later.
   */
  cardType: CardType;
  /**
   * The position in the player's deck where the card was placed.
   */
  position: number;
}