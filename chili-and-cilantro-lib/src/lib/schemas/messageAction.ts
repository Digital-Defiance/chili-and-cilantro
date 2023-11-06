import { Schema } from "mongoose";
import { IMessageDetails } from "../interfaces/messageDetails";

export const MessageActionSchema = new Schema<IMessageDetails>(
  {
    message: { type: String, required: true },
  });