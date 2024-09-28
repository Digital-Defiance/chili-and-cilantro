import {
  IEndRoundActionDocument,
  IEndRoundDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const EndRoundDetailsSchema = new Schema<IEndRoundDetails>(
  {},
  { _id: false },
);

export const EndRoundActionSchema = new Schema<IEndRoundActionDocument>({
  details: { type: EndRoundDetailsSchema, required: true },
});
