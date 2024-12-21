import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class MustBeMasterChefError extends HandleableError {
  constructor() {
    super(translate(StringNames.Error_MustBeMasterChef), { statusCode: 422 });
    this.name = 'MustBeMasterChefError';
    Object.setPrototypeOf(this, MustBeMasterChefError.prototype);
  }
}
