export class BaseError extends Error {
  public readonly message: string;
  public readonly name: string;
  constructor(message: string, name: string) {
    super(message);
    this.message = message;
    this.name = name;
  }
}