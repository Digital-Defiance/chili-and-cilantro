import {
  DefaultLanguage,
  GlobalLanguageContext,
  HandleableError,
  IRequestUser,
  IUserDocument,
  ModelName,
  StringLanguages,
  StringNames,
  TransactionCallback,
  translate,
  UserNotFoundError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  ApiResponse,
  ExpressValidationError,
  FlexibleValidationChain,
  handleError,
  IApplication,
  RouteConfig,
  RouteHandlers,
  sendApiMessageResponse,
  SendFunction,
  sendRawJsonResponse,
  withTransaction as utilsWithTransaction,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from 'express';
import {
  matchedData,
  ValidationChain,
  validationResult,
} from 'express-validator';
import { ClientSession } from 'mongoose';
import { authenticateToken } from '../middlewares/authenticate-token';
import { setGlobalContextLanguageFromRequest } from '../middlewares/set-global-context-language';

export abstract class BaseController {
  public readonly router: Router;
  private activeRequest: Request | null = null;
  private activeResponse: Response | null = null;
  public readonly application: IApplication;
  protected routeDefinitions: RouteConfig<any, any, any>[] = [];
  protected handlers: RouteHandlers<any, any, any> = {};

  public constructor(application: IApplication) {
    this.application = application;
    this.router = Router();
    this.initRouteDefinitions();
    this.initializeRoutes();
  }

  protected abstract initRouteDefinitions(): void;

  private getAuthenticationMiddleware(
    route: RouteConfig<ApiResponse, any, Array<unknown>>,
  ): RequestHandler[] {
    if (route.useAuthentication) {
      return [
        async (req, res, next) => {
          try {
            await this.authenticateRequest(route, req, res, next);
          } catch (err) {
            next(err);
          }
        },
      ];
    } else {
      return [];
    }
  }

  private getValidationMiddleware(
    route: RouteConfig<ApiResponse, any, Array<unknown>>,
  ): RequestHandler[] {
    if (Array.isArray(route.validation) && route.validation.length > 0) {
      return [
        ...route.validation,
        this.createValidationHandler(route.validation),
      ];
    } else if (typeof route.validation === 'function') {
      return [this.createDynamicValidationHandler(route.validation)];
    }
    return [];
  }

  private createValidationHandler(
    validation: ValidationChain[],
  ): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        this.checkRequestValidationAndThrow(req, res, next, validation);
      } catch (error) {
        next(error);
      }
    };
  }

  private createDynamicValidationHandler(
    validationFn: (lang: StringLanguages) => ValidationChain[],
  ): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validationArray = validationFn(GlobalLanguageContext.language);
        await Promise.all(validationArray.map((v) => v.run(req)));
        await this.checkRequestValidationAndThrow(
          req,
          res,
          next,
          validationArray,
        );
      } catch (error) {
        next(error);
      }
    };
  }

  private createRequestHandler<
    T extends ApiResponse,
    RawJsonResponse extends boolean = false,
    HandlerArgs extends Array<unknown> = Array<unknown>,
  >(config: RouteConfig<T, RawJsonResponse, HandlerArgs>): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      this.activeRequest = req;
      this.activeResponse = res;

      if (config.useAuthentication && !this.activeRequest?.user) {
        handleError(
          new HandleableError(translate(StringNames.Common_Unauthorized), {
            statusCode: 401,
          }),
          res,
          sendApiMessageResponse,
          next,
        );
        return;
      }

      try {
        const handler = this.handlers[config.handlerKey];
        const sendFunc: SendFunction<T> = config.rawJsonHandler
          ? sendRawJsonResponse.bind(this)
          : sendApiMessageResponse.bind(this);

        await handler(req, res, sendFunc, next, ...(config.handlerArgs ?? []));
      } catch (error) {
        handleError(error, res, sendApiMessageResponse, next);
      }
    };
  }

  /**
   * Initializes the routes for the controller.
   */
  private initializeRoutes(): void {
    Object.values(this.routeDefinitions).forEach(
      (config: RouteConfig<any, any, any>) => {
        this.router[config.method](
          config.path,
          ...[
            ...this.getAuthenticationMiddleware(config),
            setGlobalContextLanguageFromRequest,
            ...this.getValidationMiddleware(config),
            ...(config.middleware ?? []),
            this.createRequestHandler(config),
          ],
        );
      },
    );
  }

  /**
   * Authenticates the request by checking the token. Also populates the request with the user object.
   * @param route The route config
   * @param req The request object
   * @param res The response object
   * @param next The next function
   */
  protected async authenticateRequest(
    route: RouteConfig<ApiResponse, any, Array<unknown>>,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await authenticateToken(this.application, req, res, (err) => {
      if (err || !req.user) {
        handleError(
          new HandleableError(translate(StringNames.Common_Unauthorized), {
            statusCode: route.authFailureStatusCode ?? 401,
            cause: err,
          }),
          res,
          sendApiMessageResponse,
          next,
        );
        return;
      }
    });
    next();
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
    validationArray: FlexibleValidationChain = [],
  ): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      handleError(
        new ExpressValidationError(errors),
        res,
        sendApiMessageResponse,
        next,
      );
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

  protected async validateAndFetchRequestUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<IUserDocument> {
    const UserModel = this.application.getModel<IUserDocument>(ModelName.User);
    if (!req.user) {
      handleError(
        new HandleableError(translate(StringNames.Common_Unauthorized), {
          statusCode: 401,
        }),
        res,
        sendApiMessageResponse,
        next,
      );
      return Promise.reject();
    }
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      handleError(new UserNotFoundError(), res, sendApiMessageResponse, next);
      handleError(new UserNotFoundError(), res, sendApiMessageResponse, next);
      return Promise.reject();
    }
    return user;
  }

  public async withTransaction<T>(
    callback: TransactionCallback<T>,
    session?: ClientSession,
    ...args: any
  ) {
    return await utilsWithTransaction<T>(
      this.application.db.connection,
      this.application.useTransactions,
      session,
      callback,
      ...args,
    );
  }
}
