import { IAction } from "./action";
import { IStartNewRoundDetails } from "./startNewRoundDetails";

export interface IStartNewRoundAction extends IAction {
  details: IStartNewRoundDetails;
}