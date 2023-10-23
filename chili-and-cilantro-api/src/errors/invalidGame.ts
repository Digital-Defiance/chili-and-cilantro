import { BaseError } from "./baseError";

export class InvalidGameError extends BaseError {
  constructor() {
    super('Invalid game', 'InvalidGame');
  }
}