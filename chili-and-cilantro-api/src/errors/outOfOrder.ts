import { ValidationError } from "./validationError";

export class OutOfOrderError extends ValidationError {
  constructor() {
    super('Not your turn.', 'currentChef');
  }
}