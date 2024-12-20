import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class EmailVerifiedError extends HandleableError {
  constructor() {
    super(translate(StringNames.Error_EmailAlreadyVerified), {
      statusCode: 400,
    });
    this.name = 'EmailVerifiedError';
    Object.setPrototypeOf(this, EmailVerifiedError.prototype);
  }
}
