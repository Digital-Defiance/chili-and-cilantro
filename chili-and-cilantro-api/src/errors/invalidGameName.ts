import { ValidationError } from "./validationError";
import { MIN_GAME_NAME_LENGTH, MAX_GAME_NAME_LENGTH } from "../services/gameService";

export class InvalidGameNameError extends ValidationError {
  constructor() {
    super(`Must be alphanumeric and between ${MIN_GAME_NAME_LENGTH} and ${MAX_GAME_NAME_LENGTH}.`, "Invalid game name.");
  }
}