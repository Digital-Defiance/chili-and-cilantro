import { ValidationError } from "./validationError";

export class AlreadyJoinedError extends ValidationError {
  constructor() {
    super('You have already joined this game.', 'Chef already joined.');
  }
}