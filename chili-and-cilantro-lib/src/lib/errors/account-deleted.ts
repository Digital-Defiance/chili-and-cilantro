import { AccountStatusTypeEnum } from '../enumerations/account-status-type';
import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { AccountStatusError } from './account-status';

export class AccountDeletedError extends AccountStatusError {
  constructor(status: AccountStatusTypeEnum) {
    super(status, translate(StringNames.Error_AccountStatusIsDeleted), 404);
    this.name = 'AccountDeletedError';
    Object.setPrototypeOf(this, AccountDeletedError.prototype);
  }
}
