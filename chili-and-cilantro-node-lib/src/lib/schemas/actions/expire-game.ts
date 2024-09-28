import {
  IExpireGameActionDocument,
  IExpireGameDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const ExpireGameDetailsSchema = new Schema<IExpireGameDetails>(
  {},
  { _id: false },
);

export const ExpireGameActionSchema = new Schema<IExpireGameActionDocument>({
  details: { type: ExpireGameDetailsSchema, required: true },
});
