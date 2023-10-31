import { BaseError } from "./baseError";
export class NotHostError extends BaseError {
  constructor() {
    super(`User is not the game host`, 'NotHost');
  }
}