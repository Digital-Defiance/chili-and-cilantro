import { ValidationError } from "./validationError";

export class GamePasswordMismatchError extends ValidationError {
  constructor() {
    super('Game password does not match.', 'Game password mismatch.');
  }
}