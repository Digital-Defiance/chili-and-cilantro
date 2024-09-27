import { Types } from 'mongoose';
import { CardType } from '../../enumerations/card-type';
import { ChefState } from '../../enumerations/chef-state';
import { ICard } from '../card';

export interface IChef {
  gameId: Types.ObjectId;
  name: string;
  hand: ICard[];
  placedCards: ICard[];
  lostCards: CardType[];
  userId: Types.ObjectId;
  state: ChefState;
  host: boolean;
}
