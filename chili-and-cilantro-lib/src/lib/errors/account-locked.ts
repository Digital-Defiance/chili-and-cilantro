import { AccountStatusTypeEnum } from '../enumerations/account-status-type';
import { AccountStatusError } from './account-status';

export class AccountLockedError extends AccountStatusError {
  constructor() {
    super(AccountStatusTypeEnum.Locked);
    Object.setPrototypeOf(this, AccountLockedError.prototype);
  }
}
