import { CardType } from '../../enumerations/card-type';
import { ChefState } from '../../enumerations/chef-state';
import { DefaultIdType } from '../../shared-types';
import { ICard } from '../card';
import { IHasTimestamps } from '../has-timestamps';

export interface IChef<I = DefaultIdType> extends IHasTimestamps {
  gameId: I;
  name: string;
  hand: ICard[];
  placedCards: ICard[];
  lostCards: CardType[];
  userId: I;
  state: ChefState;
  masterChef: boolean;
}
