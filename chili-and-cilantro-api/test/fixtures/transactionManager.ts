import { ClientSession } from 'mongoose';

/**
 * Mocked version of withTransactionAsync that does not use a session
 * @param work The work callback to be executed
 * @returns
 */
export async function mockedWithTransactionAsync<TResult>(
  work: (session: ClientSession) => Promise<TResult>
): Promise<TResult> {
  return work({} as ClientSession);
}
