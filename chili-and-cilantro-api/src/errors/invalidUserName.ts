import { ValidationError } from "./validationError";
import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';

export class InvalidUserNameError extends ValidationError {
  constructor() {
    super(`Must be alphanumeric and between ${constants.MIN_USER_NAME_LENGTH} and ${constants.MAX_USER_NAME_LENGTH}.`, "Invalid user name.");
  }
}