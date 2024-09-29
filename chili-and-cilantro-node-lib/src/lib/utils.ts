import { Request, Response } from 'express';
import { Types, startSession } from 'mongoose';
import { MissingValidatedDataError } from './errors/missing-validated-data';
import { TransactionCallback } from './types/types';

/**
 * Checks if the given id is a valid string id
 * @param id The id to check
 * @returns True if the id is a valid string id
 */
export function isValidStringId(id: unknown): boolean {
  return typeof id === 'string' && Types.ObjectId.isValid(id);
}

/**
 * Verifies the required fields were validated by express-validator and sends an error response if not or calls the callback if they are
 * @param req The request object
 * @param res The response object
 * @param fields The fields to check
 * @param callback The callback to call if the fields are valid
 * @param errorCallback The function to call if a field is invalid
 * @returns The result of the callback
 */
export async function requireValidatedFieldsAsync<T = void>(
  req: Request,
  res: Response,
  fields: string[],
  callback: () => Promise<T>,
  errorCallback: (res: Response, field: string) => void,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (req.validatedBody === undefined) {
      reject(new MissingValidatedDataError());
      return;
    }

    const validatedBody = req.validatedBody;
    for (const field of fields) {
      if (validatedBody[field] === undefined) {
        errorCallback(res, field);
        reject(new MissingValidatedDataError(field));
        return;
      }
    }

    // All fields are valid, call the callback
    callback().then(resolve).catch(reject);
  });
}

/**
 * Verifies at least one of the required fields were validated by express-validator and sends an error response if not or calls the callback if they are
 * @param req The request object
 * @param res The response object
 * @param fields The fields to check
 * @param callback The callback to call if the fields are valid
 * @param errorCallback The function to call if not at least one field is valid
 * @returns The result of the callback
 */
export async function requireOneOfValidatedFieldsAsync<T = Promise<void>>(
  req: Request,
  res: Response,
  fields: string[],
  callback: () => Promise<T>,
  errorCallback: (res: Response, fields: string[]) => void,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (req.validatedBody === undefined) {
      throw new Error('No validated body found on the request');
    }
    const validatedBody = req.validatedBody;
    // return 422 if none of the fields are valid
    if (!fields.some((field) => validatedBody[field] !== undefined)) {
      errorCallback(res, fields);
      reject(new MissingValidatedDataError(fields));
      return;
    }
    // All fields are valid, call the callback
    callback().then(resolve).catch(reject);
  });
}

/**
 * Verifies the required fields were validated by express-validator and throws an error if not or calls the callback if they are
 * @param req The request object
 * @param fields The fields to check
 * @param callback The callback to call if the fields are valid
 * @returns The result of the callback
 */
export function requireValidatedFieldsOrThrow<T = void>(
  req: Request,
  fields: string[],
  callback: () => T,
): T {
  if (req.validatedBody === undefined) {
    throw new Error('No validated body found on the request');
  }
  const validatedBody = req.validatedBody;
  fields.forEach((field) => {
    if (validatedBody[field] === undefined) {
      throw new MissingValidatedDataError(field);
    }
  });
  return callback();
}

export async function withTransaction<T>(
  useTransaction: boolean,
  callback: TransactionCallback<T>,
  ...args: any
) {
  if (!useTransaction) {
    return callback(undefined, ...args);
  }
  const session = await startSession();
  try {
    session.startTransaction();
    const result = await callback(session, ...args);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}
