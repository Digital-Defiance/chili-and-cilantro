import {
  IApiErrorResponse,
  IApiExpressValidationErrorResponse,
  IApiMessageResponse,
  IApiMongoValidationErrorResponse,
  IMongoErrors,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { NextFunction, Request, Response, Router } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { RouteConfig } from '../interfaces/route-config';
import { authenticateToken } from '../middlewares/authenticate-token';

export abstract class BaseController {
  public readonly router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Returns the routes that the controller will handle.
   */
  protected abstract getRoutes(): RouteConfig[];

  /**
   * Initializes the routes for the controller.
   */
  private initializeRoutes(): void {
    const routes = this.getRoutes();
    routes.forEach((route) => {
      const {
        method,
        path,
        handler,
        useAuthentication,
        middleware = [],
        validation = [],
      } = route;
      const routeHandlers = [
        ...middleware,
        ...(useAuthentication
          ? [
              (req: Request, res: Response, next: NextFunction) =>
                this.authenticateRequest(req, res, next),
            ]
          : []),
        ...(validation.length > 0
          ? [
              ...validation,
              (req: Request, res: Response, next: NextFunction) =>
                this.validateRequest(req, res, next),
            ]
          : []),
        (req: Request, res: Response, next: NextFunction) => {
          handler.call(this, req, res, next);
        },
      ];

      this.router[method](path, ...routeHandlers);
    });
  }

  /**
   * Sends an API response with the given status and response object.
   * @param status
   * @param response
   * @param res
   */
  protected sendApiMessageResponse(
    status: number,
    response: IApiMessageResponse,
    res: Response,
  ): void {
    res.status(status).json(response);
  }

  /**
   * Sends an API response with the given status, message, and error.
   * @param status
   * @param message
   * @param error
   * @param res
   */
  protected sendApiErrorResponse(
    status: number,
    message: string,
    error: unknown,
    res: Response,
  ): void {
    res.status(status).json({ message, error } as IApiErrorResponse);
  }

  /**
   * Sends an API response with the given status and validation errors.
   * @param status
   * @param errors
   * @param res
   */
  protected sendApiExpressValidationErrorResponse(
    status: number,
    errors: ValidationError[],
    res: Response,
  ): void {
    res.status(status).json({ errors } as IApiExpressValidationErrorResponse);
  }

  /**
   * Sends an API response with the given status, message, and MongoDB validation errors.
   * @param status
   * @param message
   * @param errors
   * @param res
   */
  protected sendApiMongoValidationErrorResponse(
    status: number,
    message: string,
    errors: IMongoErrors,
    res: Response,
  ): void {
    res
      .status(status)
      .json({ message, errors } as IApiMongoValidationErrorResponse);
  }

  /**
   * Authenticates the request by checking the token. Also populates the request with the user object.
   * @param req
   * @param res
   * @param next
   */
  protected authenticateRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    authenticateToken(req, res, (err) => {
      if (err || !req.user) {
        this.sendApiMessageResponse(
          401,
          { message: 'Unauthorized' } as IApiMessageResponse,
          res,
        );
        return;
      }
      next();
    });
  }

  /**
   * Validates the request using the express-validator library.
   * @param req
   * @param res
   * @param next
   * @returns
   */
  protected validateRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      this.sendApiExpressValidationErrorResponse(400, errors.array(), res);
      return;
    }
    next();
  }
}
