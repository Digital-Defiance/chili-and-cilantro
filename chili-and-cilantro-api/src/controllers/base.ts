import {
  DefaultLanguage,
  GetModelFunction,
  GlobalLanguageContext,
  IApiErrorResponse,
  IApiExpressValidationErrorResponse,
  IApiMessageResponse,
  IApiMongoValidationErrorResponse,
  IMongoErrors,
  IRequestUser,
  StringLanguages,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  ExpressValidationError,
  RouteConfig,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { NextFunction, Request, Response, Router } from 'express';
import {
  matchedData,
  ValidationChain,
  ValidationError,
  validationResult,
} from 'express-validator';
import { authenticateToken } from '../middlewares/authenticate-token';

export abstract class BaseController {
  public readonly router: Router;
  private activeRequest: Request | null = null;
  private activeResponse: Response | null = null;
  public readonly getModel: GetModelFunction;

  protected constructor(getModel: GetModelFunction) {
    this.router = Router();
    this.initializeRoutes();
    this.getModel = getModel;
  }

  /**
   * Returns the routes that the controller will handle.
   */
  protected abstract getRoutes(): RouteConfig<unknown[]>[];

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
        ...(Array.isArray(validation) && validation.length > 0
          ? [
              ...validation,
              (req: Request, res: Response, next: NextFunction) => {
                try {
                  this.checkRequestValidationAndThrow(
                    req,
                    res,
                    next,
                    validation,
                  );
                } catch (error) {
                  next(error);
                }
              },
            ]
          : []),
        ...(typeof validation === 'function'
          ? [
              async (req: Request, res: Response, next: NextFunction) => {
                try {
                  const validationArray = validation(
                    GlobalLanguageContext.language,
                  );
                  await Promise.all(
                    validationArray.map((validation: ValidationChain) =>
                      validation.run(req),
                    ),
                  );
                  await this.checkRequestValidationAndThrow(
                    req,
                    res,
                    next,
                    validationArray,
                  );
                } catch (error) {
                  next(error);
                }
              },
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
   * @param getModel Function to get models from the database
   * @param req The request object
   * @param res The response object
   * @param next The next function
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

  private handleBooleanFields(
    validationArray: ValidationChain[],
    validatedBody: Record<string, any>,
  ): Record<string, any> {
    // false booleans will be missing from validatedBody, so we need to add them
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

        // If the field has a boolean validator and it's not in the validated body, add it
        if (hasBooleanValidator && !(field in validatedBody)) {
          validatedBody[field] = false;
        }
      });
    });
    return validatedBody;
  }

  /**
   * If express-validator flagged any errors, throw an error.
   * @param req The request object
   * @param res The response object
   * @param next The next function
   * @param validationArray An array of express validation chains that were applied to the request.
   * @returns
   */
  protected checkRequestValidationAndThrow(
    req: Request,
    res: Response,
    next: NextFunction,
    validationArray:
      | ValidationChain[]
      | ((language: StringLanguages) => ValidationChain[]) = [],
  ): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      this.sendApiExpressValidationErrorResponse(400, errors.array(), res);
      next(new ExpressValidationError(errors));
      return;
    }
    // Create an object with only the validated fields
    const validatedBody = matchedData(req, {
      locations: ['body'], // Only match data from request body
      includeOptionals: false, // Exclude fields that weren't validated
    });

    const language = GlobalLanguageContext.language ?? DefaultLanguage;

    // If validationArray is a function, call it with the language
    const valArray =
      typeof validationArray === 'function'
        ? validationArray(language)
        : validationArray;

    // false booleans will be missing from validatedBody, so we need to add them
    // Attach the validated fields to the request object
    req.validatedBody = this.handleBooleanFields(valArray, validatedBody);

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
