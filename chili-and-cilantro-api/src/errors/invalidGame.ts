import { ValidationError } from "./validationError";

export class InvalidGameError extends ValidationError {
  constructor() {
    super('Invalid game ID or game does not exist.', 'Invalid game.');
  }
}