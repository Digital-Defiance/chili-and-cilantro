import {
  StringLanguages,
  StringNames,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Error } from 'mongoose';

export class MongooseValidationError extends Error {
  public readonly errors: {
    [path: string]: Error.CastError | Error.ValidatorError;
  };
  constructor(
    validationErrors: {
      [path: string]: Error.CastError | Error.ValidatorError;
    },
    language?: StringLanguages,
  ) {
    super(
      `${translate(StringNames.ValidationError, language)}: ${JSON.stringify(validationErrors)}`,
    );
    this.errors = validationErrors;
    Object.setPrototypeOf(this, MongooseValidationError.prototype);
  }
}
