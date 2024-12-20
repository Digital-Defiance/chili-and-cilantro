import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class EmailTokenExpiredError extends HandleableError {
  constructor() {
    super(translate(StringNames.Error_EmailTokenExpired), {
      statusCode: 400,
    });
    this.name = 'EmailTokenExpiredError';
    Object.setPrototypeOf(this, EmailTokenExpiredError.prototype);
  }
}
