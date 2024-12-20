import constants from '../constants';
import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class EmailTokenSentTooRecentlyError extends HandleableError {
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
      translate(
        StringNames.Error_EmailTokenSentTooRecentlyTemplate,
        undefined,
        { TIME_REMAINING: `${timeRemaining}` },
      ),
      { statusCode: 429 },
    );
    this.name = 'EmailTokenSentTooRecentlyError';
    this.lastSent = lastSent;
    this.nextAvailableTime = nextAvailableTime;
    Object.setPrototypeOf(this, EmailTokenSentTooRecentlyError.prototype);
  }
}
