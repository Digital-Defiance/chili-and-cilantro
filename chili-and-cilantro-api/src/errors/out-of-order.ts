import { ValidationError } from './validation-error';

export class OutOfOrderError extends ValidationError {
  constructor() {
    super('Not your turn.', 'currentChef');
  }
}
