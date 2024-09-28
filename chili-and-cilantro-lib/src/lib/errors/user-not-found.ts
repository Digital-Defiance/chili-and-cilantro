export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
    this.name = 'UserNotFound';
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
