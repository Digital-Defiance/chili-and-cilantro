import { Document, Types } from 'mongoose';
import { ICard } from '../card';

export interface ICardDocument
  extends ICard,
    Document<Types.ObjectId, unknown, ICard> {}
