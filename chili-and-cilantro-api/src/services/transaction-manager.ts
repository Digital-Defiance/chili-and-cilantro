import { TransactionCallback } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ClientSession, startSession } from 'mongoose';

export abstract class TransactionManager {
  public async withTransaction<T>(
    useTransaction: boolean,
    session: ClientSession | undefined,
    callback: TransactionCallback<T>,
    ...args: any
  ) {
    if (!useTransaction) {
      return callback(session, undefined, ...args);
    }
    const needSession = useTransaction && session === undefined;
    const s = needSession ? await startSession() : session;
    try {
      if (needSession && s !== undefined) await s.startTransaction();
      const result = await callback(s, ...args);
      if (needSession && s !== undefined) await s.commitTransaction();
      return result;
    } catch (error) {
      if (needSession && s !== undefined && s.inTransaction())
        await s.abortTransaction();
      throw error;
    } finally {
      if (needSession && s !== undefined) await s.endSession();
    }
  }
}
