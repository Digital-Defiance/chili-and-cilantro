import { DefaultIdType } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { randomBytes, randomInt } from 'crypto';
import { Types } from 'mongoose';

/**
 * Generates a random string of length between minLength and maxLength
 * @param minLength
 * @param maxLength
 * @returns
 */
export function generateString(minLength: number, maxLength: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  const length = randomInt(minLength, maxLength + 1);
  const bytes = randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[bytes[i] % characters.length];
  }
  return result;
}

/**
 * Generates a random number between min and max
 * @param min
 * @param max
 * @returns
 */
export function numberBetween(min: number, max: number): number {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  let randomNumber;
  do {
    const bytes = randomBytes(bytesNeeded);
    randomNumber = bytes.readUIntBE(0, bytesNeeded);
  } while (randomNumber >= range * Math.floor(256 ** bytesNeeded / range));
  return min + (randomNumber % range);
}

export function generateObjectId(): DefaultIdType {
  return new Types.ObjectId();
}
