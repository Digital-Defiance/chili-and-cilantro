import { ClientSession, startSession } from 'mongoose';

export abstract class TransactionManager {
  protected async withTransaction<TResult>(
    work: (session: ClientSession) => Promise<TResult>
  ): Promise<TResult> {
    const session = await startSession();
    try {
      session.startTransaction();
      const result = await work(session);
      await session.commitTransaction();
      return result;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }
}
