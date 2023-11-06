import { ValidationError } from "./validationError";
import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';

export class InvalidMessageError extends ValidationError {
  constructor() {
    super(`Message must be between ${constants.MIN_MESSAGE_LENGTH} and ${constants.MAX_MESSAGE_LENGTH} characters long.`, 'message');
  }
}