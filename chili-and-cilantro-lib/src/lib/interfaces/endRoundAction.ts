import { IAction } from "./action";
import { IEndRoundDetails } from "./endRoundDetails";

export interface IEndRoundAction extends IAction {
  details: IEndRoundDetails;
}