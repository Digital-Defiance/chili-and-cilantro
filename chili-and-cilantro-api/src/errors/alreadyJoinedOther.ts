import { ValidationError } from "./validationError";

export class AlreadyJoinedOtherError extends ValidationError {
  constructor() {
    super('Chef is already in an active game.', 'Chef already in an active game.');
  }
}