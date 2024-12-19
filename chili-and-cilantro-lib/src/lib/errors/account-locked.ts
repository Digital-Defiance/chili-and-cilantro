import { AccountStatusTypeEnum } from '../enumerations/account-status-type';
import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { AccountStatusError } from './account-status';

export class AccountLockedError extends AccountStatusError {
  constructor() {
    super(
      AccountStatusTypeEnum.Locked,
      translate(StringNames.Error_AccountStatusIsLocked),
    );
    this.name = 'AccountLockedError';
    Object.setPrototypeOf(this, AccountLockedError.prototype);
  }
}
