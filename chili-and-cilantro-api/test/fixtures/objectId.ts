import { faker } from '@faker-js/faker';
import { Schema } from 'mongoose';

export function generateObjectId(): Schema.Types.ObjectId {
  return new Schema.Types.ObjectId(faker.string.uuid());
}