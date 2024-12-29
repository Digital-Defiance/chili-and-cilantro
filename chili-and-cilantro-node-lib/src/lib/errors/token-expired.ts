import {
  HandleableError,
  StringNames,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';

export class TokenExpiredError extends HandleableError {
  constructor() {
    super(translate(StringNames.Validation_TokenExpired), { statusCode: 401 });
  }
}
