import { Types } from 'mongoose';
import { IAction } from '../action';
import { IJoinGameDetails } from './details/join-game';

export interface IJoinGameAction<T = Types.ObjectId> extends IAction<T> {
  details: IJoinGameDetails;
}
