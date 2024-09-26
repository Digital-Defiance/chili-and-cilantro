import { Schema } from 'mongoose';
import { IExpireGameAction } from '../interfaces/expireGameAction';
import { IExpireGameDetails } from '../interfaces/expireGameDetails';

export const ExpireGameDetailsSchema = new Schema<IExpireGameDetails>(
  {},
  { _id: false }
);

export const ExpireGameActionSchema = new Schema<IExpireGameAction>({
  details: { type: ExpireGameDetailsSchema, required: true },
});
