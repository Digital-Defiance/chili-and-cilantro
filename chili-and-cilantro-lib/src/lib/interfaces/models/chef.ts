import { CardType } from '../../enumerations/card-type';
import { ChefState } from '../../enumerations/chef-state';
import { DefaultIdType } from '../../shared-types';
import { ICard } from '../card';

export interface IChef<I = DefaultIdType> {
  gameId: I;
  name: string;
  hand: ICard[];
  placedCards: ICard[];
  lostCards: CardType[];
  userId: I;
  state: ChefState;
  host: boolean;
}
