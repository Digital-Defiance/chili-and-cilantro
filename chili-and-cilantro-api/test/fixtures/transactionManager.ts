import { ClientSession } from "mongoose";

export async function mockedWithTransactionAsync<TResult>(work: (session: ClientSession) => Promise<TResult>): Promise<TResult> {
  return work({} as ClientSession);
}