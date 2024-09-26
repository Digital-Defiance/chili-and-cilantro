import { Schema } from 'mongoose';
import { ChefState } from '../enumerations/chefState';
import { ICard } from './card';
import { IHasID } from './hasId';
import { CardType } from '../enumerations/cardType';

export interface IChef extends IHasID {
  gameId: Schema.Types.ObjectId;
  name: string;
  hand: ICard[];
  placedCards: ICard[];
  lostCards: CardType[];
  userId: Schema.Types.ObjectId;
  state: ChefState;
  host: boolean;
}
