import { ValidationError } from "./validationError";

export class NotInGameError extends ValidationError {
  constructor() {
    super('You are not in this game!', 'chefIds');
  }
}