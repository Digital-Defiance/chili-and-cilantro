import { faker } from '@faker-js/faker';
import { Schema } from 'mongoose';

export function generateObjectId(): Schema.Types.ObjectId {
  const stringId = faker.string.uuid();
  const objectId = new Schema.Types.ObjectId(stringId);
  // add a toString method to the objectId so that it can be used in comparisons
  objectId.toString = () => stringId;
  return objectId;
}