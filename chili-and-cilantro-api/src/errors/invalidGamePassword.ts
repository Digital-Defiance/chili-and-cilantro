import { ValidationError } from "./validationError";
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "../services/gameService";

export class InvalidGamePasswordError extends ValidationError {
  constructor() {
    super(`Must be alphanumeric and between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}.`, "Invalid game password.");
  }
}