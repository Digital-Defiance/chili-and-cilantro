import { CardType } from '../enumerations/card-type';
import { IHasID } from './has-id';

export interface ICard extends IHasID {
  type: CardType;
  faceUp: boolean;
}
