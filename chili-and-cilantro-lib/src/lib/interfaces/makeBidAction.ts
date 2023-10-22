import { IAction } from "./action";
import { IMakeBidDetails } from "./makeBidDetails";

export interface IMakeBidAction extends IAction {
  details: IMakeBidDetails;
}