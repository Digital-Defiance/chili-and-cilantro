import { IAction } from "./action";
import { IFlipCardDetails } from "./flipCardDetails";

export interface IFlipCardAction extends IAction {
  details: IFlipCardDetails;
}