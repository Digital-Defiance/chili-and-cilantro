import { BaseError } from "./baseError";
export class UsernameExistsError extends BaseError {
  public readonly username: string;
  constructor(username: string) {
    super('Username already exists', 'UsernameExistsError');
    this.username = username;
  }
}
