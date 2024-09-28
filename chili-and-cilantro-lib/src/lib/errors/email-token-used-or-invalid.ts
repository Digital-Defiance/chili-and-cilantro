export class EmailTokenUsedOrInvalidError extends Error {
  constructor() {
    super('Email verification link has already been used or is invalid');
    this.name = 'EmailTokenUsedOrInvalidError';
    Object.setPrototypeOf(this, EmailTokenUsedOrInvalidError.prototype);
  }
}
