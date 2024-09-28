import {
  IPassActionDocument,
  IPassDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const PassDetailsSchema = new Schema<IPassDetails>({}, { _id: false });

export const PassActionSchema = new Schema<IPassActionDocument>({
  ...ActionSchemaBase,
  details: { type: PassDetailsSchema, required: true },
});
