import { IAction } from '../action';
import { IMakeBidDetails } from './details/make-bid';

export interface IMakeBidAction extends IAction {
  details: IMakeBidDetails;
}
