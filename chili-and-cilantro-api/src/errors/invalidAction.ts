import { TurnAction } from "@chili-and-cilantro/chili-and-cilantro-lib";
import { ValidationError } from "./validationError";

export class InvalidActionError extends ValidationError {
  constructor(action: TurnAction, amount?: number) {
    const amountString = amount ? ' ' + amount.toString() : '';
    super(`Invalid action: ${action}${amountString}`, 'game.action');
  }
}