import { ValidationError } from "./validationError";
import constants from "../constants";

export class InvalidGamePasswordError extends ValidationError {
  constructor() {
    super(`Must be alphanumeric and between ${constants.MIN_PASSWORD_LENGTH} and ${constants.MAX_PASSWORD_LENGTH}.`, "Invalid game password.");
  }
}