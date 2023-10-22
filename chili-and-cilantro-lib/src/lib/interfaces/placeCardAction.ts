import { IAction } from "./action";
import { IPlaceCardDetails } from "./placeCardDetails";

export interface IPlaceCardAction extends IAction {
  details: IPlaceCardDetails;
}