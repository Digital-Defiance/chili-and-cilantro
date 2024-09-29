import {
  IApplication,
  TransactionCallback,
  withTransaction as utilsWithTransaction,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { ClientSession } from 'mongoose';

export class BaseService {
  protected readonly application: IApplication;
  protected readonly useTransactions: boolean;

  public constructor(application: IApplication, useTransactions = true) {
    this.application = application;
    this.useTransactions = useTransactions;
  }
  public async withTransaction<T>(
    callback: TransactionCallback<T>,
    session?: ClientSession,
    ...args: any
  ) {
    return await utilsWithTransaction<T>(
      this.application.db.connection,
      this.useTransactions,
      session,
      callback,
      ...args,
    );
  }
}
