import mongoose from 'mongoose';

export class MongooseValidationError extends Error {
  public readonly errors: {
    [path: string]: mongoose.Error.CastError | mongoose.Error.ValidatorError;
  };
  constructor(validationErrors: {
    [path: string]: mongoose.Error.CastError | mongoose.Error.ValidatorError;
  }) {
    super(`Validation error: ${JSON.stringify(validationErrors)}`);
    this.name = 'ValidationError';
    this.errors = validationErrors;
  }
}
