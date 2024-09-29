import {
  IStartNewRoundActionDocument,
  IStartNewRoundDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const StartNewRoundDetailsSchema = new Schema<IStartNewRoundDetails>(
  {},
  { _id: false },
);

export const StartNewRoundActionSchema =
  new Schema<IStartNewRoundActionDocument>({
    ...ActionSchemaBase,
    details: { type: StartNewRoundDetailsSchema, required: true },
  });
