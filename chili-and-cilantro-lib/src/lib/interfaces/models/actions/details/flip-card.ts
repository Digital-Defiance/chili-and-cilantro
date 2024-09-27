import { Types } from 'mongoose';

export interface IFlipCardDetails {
  chef: Types.ObjectId;
  card: Types.ObjectId;
  cardIndex: number;
}
