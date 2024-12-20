import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class EmailInUseError extends HandleableError {
  constructor() {
    super(translate(StringNames.Error_EmailInUse), { statusCode: 400 });
    this.name = 'EmailInUseError';
    Object.setPrototypeOf(this, EmailInUseError.prototype);
  }
}
