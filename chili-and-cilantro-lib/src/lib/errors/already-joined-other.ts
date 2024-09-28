import { ValidationError } from './validation-error';

export class AlreadyJoinedOtherError extends ValidationError {
  constructor() {
    super('Chef is already in an active game.');
    Object.setPrototypeOf(this, AlreadyJoinedOtherError.prototype);
  }
}
