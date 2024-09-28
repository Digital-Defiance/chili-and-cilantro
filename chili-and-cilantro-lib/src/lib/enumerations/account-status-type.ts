export const AccountStatusTypes = [
  'NewUnverified',
  'Active',
  'AdminDelete',
  'SelfDeleteWaitPeriod',
  'SelfDelete',
  'Locked',
] as const;
export type AccountStatusType = (typeof AccountStatusTypes)[number];

export enum AccountStatusTypeEnum {
  /**
   * The account is new and unverified.
   */
  NewUnverified = 'NewUnverified',
  /**
   * The account is active.
   */
  Active = 'Active',
  /**
   * The account has been deleted by an administrator.
   */
  AdminDelete = 'AdminDelete',
  /**
   * The account has been deleted by the user,
   * but the deletion is pending the wait period.
   */
  SelfDeleteWaitPeriod = 'SelfDeleteWaitPeriod',
  /**
   * The account has been fully deleted by the user,
   */
  SelfDelete = 'SelfDelete',
  Locked = 'Locked',
}
