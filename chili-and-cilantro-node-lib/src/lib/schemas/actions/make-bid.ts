import {
  IMakeBidActionDocument,
  IMakeBidDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ActionSchemaBase } from '../action';

export const MakeBidDetailsSchema = new Schema<IMakeBidDetails>(
  {
    bidNumber: { type: Number, required: true },
  },
  { _id: false },
);

export const MakeBidActionSchema = new Schema<IMakeBidActionDocument>({
  ...ActionSchemaBase,
  details: { type: MakeBidDetailsSchema, required: true },
});
