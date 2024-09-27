import mongoose, { ClientSession } from 'mongoose';
import { TransactionManager } from '../../src/services/transaction-manager';

class TestTransactionManager extends TransactionManager {
  public async withTransaction<TResult>(
    work: (session: ClientSession) => Promise<TResult>,
  ): Promise<TResult> {
    return super.withTransaction(work);
  }
}

describe('transactionManager', () => {
  describe('withTransaction', () => {
    let mockStartSession,
      mockCommitTransaction,
      mockAbortTransaction,
      mockEndSession;

    beforeEach(() => {
      mockCommitTransaction = jest.fn();
      mockAbortTransaction = jest.fn();
      mockEndSession = jest.fn();

      const mockedSession = {
        startTransaction: jest.fn(),
        commitTransaction: mockCommitTransaction,
        abortTransaction: mockAbortTransaction,
        endSession: mockEndSession,
      };

      mockStartSession = jest
        .spyOn(mongoose, 'startSession')
        .mockResolvedValue(mockedSession as unknown as ClientSession);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should commit the transaction if the callback succeeds', async () => {
      const manager = new TestTransactionManager();
      const mockCallback = jest.fn().mockResolvedValue('success');

      await manager.withTransaction(mockCallback);

      expect(mockCallback).toHaveBeenCalled();
      expect(mockCommitTransaction).toHaveBeenCalled();
      expect(mockAbortTransaction).not.toHaveBeenCalled();
      expect(mockEndSession).toHaveBeenCalled();
    });

    it('should rollback the transaction if the callback fails', async () => {
      const manager = new TestTransactionManager();
      const mockError = new Error('Error in callback');
      const mockCallback = jest.fn().mockRejectedValue(mockError);

      await expect(manager.withTransaction(mockCallback)).rejects.toThrow(
        mockError,
      );

      expect(mockCallback).toHaveBeenCalled();
      expect(mockCommitTransaction).not.toHaveBeenCalled();
      expect(mockAbortTransaction).toHaveBeenCalled();
      expect(mockEndSession).toHaveBeenCalled();
    });

    it('should return the result of the callback', async () => {
      const manager = new TestTransactionManager();
      const expectedResult = 'result';
      const mockCallback = jest.fn().mockResolvedValue(expectedResult);

      const result = await manager.withTransaction(mockCallback);

      expect(result).toBe(expectedResult);
    });
  });
});
