export class EmailTokenExpiredError extends Error {
  constructor() {
    super('Verification link has expired. Please request a new one.');
    this.name = 'EmailTokenExpiredError';
    Object.setPrototypeOf(this, EmailTokenExpiredError.prototype);
  }
}
