import { IAction } from '../action';
import { IJoinGameDetails } from './details/join-game';

export interface IJoinGameAction extends IAction {
  details: IJoinGameDetails;
}
