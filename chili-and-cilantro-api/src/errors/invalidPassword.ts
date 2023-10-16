import { BaseError } from "./baseError";
export class InvalidPassword extends BaseError {
  constructor(message: string) {
    super(message, 'InvalidPassword');
  }
}
