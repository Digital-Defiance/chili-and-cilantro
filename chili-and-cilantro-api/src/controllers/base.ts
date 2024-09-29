import {
  IApiErrorResponse,
  IApiExpressValidationErrorResponse,
  IApiMessageResponse,
  IApiMongoValidationErrorResponse,
  IMongoErrors,
  IRequestUser,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { NextFunction, Request, Response, Router } from 'express';
import {
  matchedData,
  ValidationChain,
  ValidationError,
  validationResult,
} from 'express-validator';
import { RouteConfig } from '../interfaces/route-config';
import { authenticateToken } from '../middlewares/authenticate-token';

export abstract class BaseController {
  public readonly router: Router;
  private activeRequest: Request | null = null;
  private activeResponse: Response | null = null;
  public readonly getModel: GetModelFunction;

  constructor(getModel: GetModelFunction) {
    this.router = Router();
    this.initializeRoutes();
    this.getModel = getModel;
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
        ...(useAuthentication
          ? [
              (req: Request, res: Response, next: NextFunction) =>
                this.authenticateRequest(this.getModel, req, res, next),
            ]
          : []),
        ...(validation.length > 0
          ? [
              ...validation,
              (req: Request, res: Response, next: NextFunction) =>
                this.validateRequest(req, res, next),
            ]
          : []),
        ...middleware,
        (req: Request, res: Response, next: NextFunction) => {
          this.activeRequest = req;
          this.activeResponse = res;
          // if req.user wasn't added above, return an unauthorized response
          if (useAuthentication && !req.user) {
            this.sendApiMessageResponse(
              401,
              { message: 'Unauthorized' } as IApiMessageResponse,
              res,
            );
            return;
          }
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
    getModel: GetModelFunction,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    authenticateToken(getModel, req, res, (err) => {
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
   * @param req The request object
   * @param res The response object
   * @param next The next function
   * @param validationArray An array of express validation chains to apply to the request.
   * @returns
   */
  protected validateRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    validationArray: ValidationChain[] = [],
  ): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      this.sendApiExpressValidationErrorResponse(400, errors.array(), res);
      return;
    }
    // Create an object with only the validated fields
    const validatedBody = matchedData(req, {
      locations: ['body'], // Only match data from request body
      includeOptionals: false, // Exclude fields that weren't validated
    });

    validationArray.forEach((validation: ValidationChain) => {
      const fieldChains = validation.builder.build().fields;

      fieldChains.forEach((field: string) => {
        const hasBooleanValidator = validation.builder
          .build()
          .stack.some((item: any) => {
            return (
              item.validator &&
              typeof item.validator === 'function' &&
              item.validator.name === 'isBoolean' &&
              !item.negated
            );
          });

        if (hasBooleanValidator && !(field in validatedBody)) {
          validatedBody[field] = false;
        }
      });
    });

    // Attach the validated fields to the request object
    req.validatedBody = validatedBody;

    next();
  }

  public get user(): IRequestUser {
    if (!this.activeRequest) {
      throw new Error('No active request');
    }
    if (!this.activeRequest.user) {
      throw new Error('No user on request');
    }
    return this.activeRequest.user;
  }

  public get validatedBody(): Record<string, any> {
    if (!this.activeRequest) {
      throw new Error('No active request');
    }
    if (!this.activeRequest.validatedBody) {
      throw new Error('No validated body on request');
    }
    return this.activeRequest.validatedBody;
  }

  public get req(): Request {
    if (!this.activeRequest) {
      throw new Error('No active request');
    }
    return this.activeRequest;
  }

  public get res(): Response {
    if (!this.activeResponse) {
      throw new Error('No active response');
    }
    return this.activeResponse;
  }
}
