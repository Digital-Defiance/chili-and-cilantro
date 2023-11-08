import { TurnAction } from "@chili-and-cilantro/chili-and-cilantro-lib";
import { ValidationError } from "./validationError";
import { CardType } from "chili-and-cilantro-lib/src/lib/enumerations/cardType";

export class InvalidActionError extends ValidationError {
  constructor(action: TurnAction, amount?: number, ingredient?: CardType) {
    const amountString = amount ? ' ' + amount.toString() : '';
    const ingredientString = ingredient ? ' ' + ingredient.toString() : '';
    if (action === TurnAction.Bid || action === TurnAction.IncreaseBid) {
      super(`Invalid action: ${action}${amountString}`, 'game.action.bid');
    } else if (action === TurnAction.PlaceCard) {
      super(`Invalid action: ${action}${ingredientString}`, 'game.action.placeCard');
    } else if (action === TurnAction.Pass) {
      super(`Invalid action: ${action}`, 'game.action.pass');
    } else {
      throw new Error(`unexpected invalid action: ${action}`);
    }
  }
}