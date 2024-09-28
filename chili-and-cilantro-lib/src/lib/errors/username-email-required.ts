export class UsernameOrEmailRequiredError extends Error {
  constructor() {
    super('Either username or email is required');
    this.name = 'UsernameOrEmailRequiredError';
    Object.setPrototypeOf(this, UsernameOrEmailRequiredError.prototype);
  }
}
