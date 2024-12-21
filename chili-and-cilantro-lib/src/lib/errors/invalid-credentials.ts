import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class InvalidCredentialsError extends HandleableError {
  constructor() {
    super(translate(StringNames.Error_InvalidCredentials), { statusCode: 401 });
    this.name = 'InvalidCredentialsError';
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}
