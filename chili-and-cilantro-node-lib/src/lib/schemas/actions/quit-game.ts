import { Schema } from 'mongoose';
import { IQuitGameActionDocument, IQuitGameDetails, QuitGameReason } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const QuitGameDetailsSchema = new Schema<IQuitGameDetails>(
  {
    reason: {
      type: String,
      enum: Object.values(QuitGameReason),
      required: true,
    },
  },
  { _id: false },
);

export const QuitGameActionSchema = new Schema<IQuitGameActionDocument>({
  details: { type: QuitGameDetailsSchema, required: true },
});
