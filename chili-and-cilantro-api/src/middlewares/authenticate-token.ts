import {
  AccountStatusTypeEnum,
  GetModelFunction,
  ITokenUser,
  IUserDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { JwtService } from '../services/jwt';
import { RequestUserService } from '../services/request-user';

/**
 * Find the auth token in the headers
 * @param headers The headers
 * @returns The auth token
 */
export function findAuthToken(headers: IncomingHttpHeaders): string | null {
  const authHeader = headers['Authorization'] || headers['authorization'];
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
  }
  return null;
}

/**
 * Middleware to authenticate a token
 * @param getModel Function to get a model
 * @param req The request
 * @param res The response
 * @param next The next function
 * @returns The response
 */
export function authenticateToken(
  getModel: GetModelFunction,
  req: Request,
  res: Response,
  next: NextFunction,
): Response {
  const UserModel = getModel<IUserDocument>(ModelName.User);
  const token = findAuthToken(req.headers);
  if (token == null) {
    return res.status(401).send('No token provided');
  }

  const jwtService: JwtService = new JwtService();
  jwtService
    .verifyToken(token)
    .then((user: ITokenUser) => {
      UserModel.findById(user.userId, { password: 0 })
        .then((userDoc) => {
          if (
            !userDoc ||
            userDoc.accountStatusType !== AccountStatusTypeEnum.Active
          ) {
            return res.status(403).send('User not found or inactive');
          }
          req.user = RequestUserService.makeRequestUser(userDoc);
          next();
        })
        .catch((err) => {
          console.error('Error finding user:', err);
          return res.status(500).send('Internal server error');
        });
    })
    .catch((err) => {
      console.error('Error verifying token:', err);
      return res.status(403).send('Invalid token');
    });
}
