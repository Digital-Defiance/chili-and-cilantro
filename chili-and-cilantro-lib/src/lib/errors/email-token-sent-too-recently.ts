import constants from '../constants';

export class EmailTokenSentTooRecentlyError extends Error {
  public readonly lastSent: Date;
  public readonly nextAvailableTime: Date;

  constructor(lastSent: Date) {
    const now = Date.now();
    const nextAvailableTime = new Date(
      lastSent.getTime() + constants.EMAIL_TOKEN_RESEND_INTERVAL,
    );
    const timeRemaining = Math.max(
      0,
      Math.ceil((nextAvailableTime.getTime() - now) / 1000),
    );

    super(
      `Email token sent too recently. Please try again in ${timeRemaining} seconds.`,
    );
    this.name = 'EmailTokenSentTooRecentlyError';
    this.lastSent = lastSent;
    this.nextAvailableTime = nextAvailableTime;
    Object.setPrototypeOf(this, EmailTokenSentTooRecentlyError.prototype);
  }
}
