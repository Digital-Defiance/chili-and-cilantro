import { NextFunction, Request, Response } from 'express';
import {
  auth,
  claimCheck,
  InsufficientScopeError,
} from 'express-oauth2-jwt-bearer';
import { environment } from '../environment';

export const validateAccessToken = auth({
  issuerBaseURL: `https://${environment.auth0.domain}/`,
  audience: environment.auth0.audience,
});

export const checkRequiredPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissionCheck = claimCheck((payload) => {
      const permissions = payload.permissions as string[];

      const hasPermissions = requiredPermissions.every((requiredPermission) =>
        permissions.includes(requiredPermission),
      );

      if (!hasPermissions) {
        throw new InsufficientScopeError();
      }

      return hasPermissions;
    });

    permissionCheck(req, res, next);
  };
};