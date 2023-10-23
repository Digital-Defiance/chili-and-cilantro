import { ValidationError } from "./validationError";

export class GameFullError extends ValidationError {
  constructor() {
    super('Game is full.', 'Game full.');
  }
}