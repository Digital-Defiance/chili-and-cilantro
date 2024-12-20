import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class EmailTokenUsedOrInvalidError extends HandleableError {
  constructor() {
    super(translate(StringNames.Error_EmailTokenAlreadyUsed), {
      statusCode: 400,
    });
    this.name = 'EmailTokenUsedOrInvalidError';
    Object.setPrototypeOf(this, EmailTokenUsedOrInvalidError.prototype);
  }
}
