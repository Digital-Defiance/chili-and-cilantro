import { IAction } from './action';
import { IJoinGameDetails } from './joinGameDetails';

export interface IJoinGameAction extends IAction {
  details: IJoinGameDetails;
}
