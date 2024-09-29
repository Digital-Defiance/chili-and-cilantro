import {
  IRequestUser,
  ValidatedBody,
} from '@chili-and-cilantro/chili-and-cilantro-lib';

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
      validatedBody?: ValidatedBody<string>;
    }
  }
}
