import { IAction } from "./action";
import { IStartBiddingDetails } from "./startBiddingDetails";

export interface IStartBiddingAction extends IAction {
  details: IStartBiddingDetails;
}