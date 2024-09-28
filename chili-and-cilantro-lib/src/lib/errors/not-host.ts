export class NotHostError extends Error {
  constructor() {
    super(`User is not the game host`);
    Object.setPrototypeOf(this, NotHostError.prototype);
  }
}
