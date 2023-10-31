import { ValidationError } from "./validationError";
import constants from "../constants";

export class InvalidGameNameError extends ValidationError {
  constructor() {
    super(`Must be alphanumeric and between ${constants.MIN_GAME_NAME_LENGTH} and ${constants.MAX_GAME_NAME_LENGTH}.`, "Invalid game name.");
  }
}