import { IAction } from "./action";
import { IPassDetails } from "./passDetails";

export interface IPassAction extends IAction {
  details: IPassDetails;
}