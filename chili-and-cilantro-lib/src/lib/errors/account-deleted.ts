export class AccountDeletedError extends Error {
  constructor() {
    super('Account has been deleted');
    this.name = 'AccountDeletedError';
    Object.setPrototypeOf(this, AccountDeletedError.prototype);
  }
}
