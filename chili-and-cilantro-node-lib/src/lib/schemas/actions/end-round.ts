import {
  IEndRoundActionDocument,
  IEndRoundDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const EndRoundDetailsSchema = new Schema<IEndRoundDetails>(
  {},
  { _id: false },
);

export const EndRoundActionSchema = new Schema<IEndRoundActionDocument>({
  ...ActionSchemaBase,
  details: { type: EndRoundDetailsSchema, required: true },
});
