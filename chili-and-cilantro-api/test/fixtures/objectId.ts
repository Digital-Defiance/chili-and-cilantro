import { DefaultIdType } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Types } from 'mongoose';

export function generateObjectId(): DefaultIdType {
  return new Types.ObjectId();
}
