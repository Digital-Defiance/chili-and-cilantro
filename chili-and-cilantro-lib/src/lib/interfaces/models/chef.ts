import { Types } from 'mongoose';
import { CardType } from '../../enumerations/card-type';
import { ChefState } from '../../enumerations/chef-state';
import { ICard } from '../card';

export interface IChef<T = Types.ObjectId> {
  gameId: T;
  name: string;
  hand: ICard[];
  placedCards: ICard[];
  lostCards: CardType[];
  userId: T;
  state: ChefState;
  host: boolean;
}
