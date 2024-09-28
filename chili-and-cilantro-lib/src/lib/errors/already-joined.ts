import { ValidationError } from './validation-error';

export class AlreadyJoinedError extends ValidationError {
  constructor() {
    super('You have already joined this game.');
    Object.setPrototypeOf(this, AlreadyJoinedError.prototype);
  }
}
