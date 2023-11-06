import { IAction } from "./action";
import { IEndGameDetails } from "./endGameDetails";

export interface IEndGameAction extends IAction {
  details: IEndGameDetails;
}