import { IAction } from "./action";
import { IQuitGameDetails } from "./quitGameDetails";

export interface IQuitGameAction extends IAction {
  details: IQuitGameDetails;
}