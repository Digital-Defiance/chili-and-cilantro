import mongoose from 'mongoose';

export interface IMongoErrors {
  [key: string]: mongoose.Error.ValidatorError | mongoose.Error.CastError;
}
