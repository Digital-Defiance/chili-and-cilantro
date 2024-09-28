import {
  CardType,
  TurnAction,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ValidationError } from './validation-error';

export class InvalidActionError extends ValidationError {
  constructor(action: TurnAction, amount?: number, ingredient?: CardType) {
    const amountString = amount ? ' ' + amount.toString() : '';
    const ingredientString = ingredient ? ' ' + ingredient.toString() : '';
    if (action === TurnAction.Bid || action === TurnAction.IncreaseBid) {
      super(`Invalid action: ${action}${amountString}`);
    } else if (action === TurnAction.PlaceCard) {
      super(`Invalid action: ${action}${ingredientString}`);
    } else if (action === TurnAction.Pass) {
      super(`Invalid action: ${action}`);
    } else {
      throw new Error(`unexpected invalid action: ${action}`);
    }
    Object.setPrototypeOf(this, InvalidActionError.prototype);
  }
}
