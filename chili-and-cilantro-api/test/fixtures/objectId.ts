import { faker } from '@faker-js/faker';
import { Schema } from 'mongoose';

/**
 * Generate a random ObjectId and add a toString method to it so that it can be used in comparisons
 * @returns 
 */
export function generateObjectId(): Schema.Types.ObjectId {
  const stringId = faker.string.uuid();
  const objectId = new Schema.Types.ObjectId(stringId);
  // add a toString method to the objectId so that it can be used in comparisons
  objectId.toString = () => stringId;
  return objectId;
}