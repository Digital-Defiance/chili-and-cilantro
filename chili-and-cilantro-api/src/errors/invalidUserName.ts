import { ValidationError } from "./validationError";
import { MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH } from "../services/gameService";

export class InvalidUserNameError extends ValidationError {
  constructor() {
    super(`Must be alphanumeric and between ${MIN_USER_NAME_LENGTH} and ${MAX_USER_NAME_LENGTH}.`, "Invalid user name.");
  }
}