import { CardType } from '../enumerations/card-type';

export interface ICard {
  type: CardType;
  faceUp: boolean;
}
