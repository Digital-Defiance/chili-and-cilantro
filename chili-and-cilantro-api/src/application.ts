import {
  debugLog,
  GetModelFunction,
  HandleableError,
  IBaseDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  getSchemaMap,
  handleError,
  IApplication,
  SchemaMap,
  sendApiMessageResponse,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import express, { Application, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import mongoose, { connect, connection, Model } from 'mongoose';
import { environment } from './environment';
import { Middlewares } from './middlewares';
import { ApiRouter } from './routers/api';
import { AppRouter } from './routers/app';

/**
 * Application class
 */
export class App implements IApplication {
  private static instance: App | null = null;
  /**
   * Express application instance
   */
  public readonly expressApp: Application;
  /**
   * Mongoose database instance
   */
  private _db?: typeof mongoose;
  /**
   * Schema map for all models
   */
  private _schemaMap: SchemaMap | undefined;
  public get schemaMap(): SchemaMap {
    if (!this._schemaMap) {
      throw new Error('schemaMap is not loaded yet. call start() first');
    }
    return this._schemaMap;
  }
  /**
   * Flag indicating whether the application is ready to handle requests
   */
  private _ready: boolean;

  /**
   * HTTP server instance
   */
  private server: Server | null = null;
  private _useTransactions = true;
  public get useTransactions(): boolean {
    return this._useTransactions;
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  /**
   * Get the connected MongoDB database instance
   */
  public get db(): typeof mongoose {
    if (!this._db) {
      throw new Error('db is not connected yet. call start() first');
    }
    return this._db;
  }

  /**
   * Get whether the application is ready to handle requests
   */
  public get ready(): boolean {
    return this._ready;
  }

  constructor() {
    if (App.instance) {
      throw new Error('App instance already exists, use getInstance()');
    }
    this._ready = false;
    this.expressApp = express();
    this.server = null;
  }

  /**
   * Start the application
   */
  public async start(mongoUri?: string): Promise<void> {
    const mongo_uri = mongoUri ?? environment.mongo.uri;
    this._useTransactions = environment.mongo.useTransactions;
    try {
      if (this._ready) {
        console.error(
          'Failed to start the application:',
          'Application is already running',
        );
        process.exit(1);
      }
      debugLog(
        environment.developer.debug,
        'log',
        '[ connecting ] MongoDB',
        mongo_uri,
      );
      this._db = await connect(mongo_uri);
      connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      connection.on('disconnected', () => {
        debugLog(environment.developer.debug, 'log', 'MongoDB disconnected');
      });

      await new Promise<void>((resolve) => {
        if (connection.readyState === 1) {
          resolve();
        } else {
          connection.once('connected', resolve);
        }
      });
      debugLog(environment.developer.debug, 'log', '[ connected ] MongoDB');

      debugLog(environment.developer.debug, 'log', '[ loading ] Schemas');
      this._schemaMap = getSchemaMap(this.db.connection);

      if (environment.developer.debug) {
        Object.values(this._schemaMap).forEach((schema) => {
          console.log(`[ loaded ] schema '${schema.name}'`);
        });
      }

      // init all middlewares and routes
      Middlewares.init(this.expressApp);
      const apiRouter = new ApiRouter(this);
      const appRouter = new AppRouter(apiRouter);

      appRouter.init(this.expressApp);
      // if none of the above handle the request, pass it to error handler
      this.expressApp.use(
        (
          err: HandleableError | Error,
          req: Request,
          res: Response,
          next: NextFunction,
        ) => {
          const handleableError =
            err instanceof HandleableError
              ? err
              : new HandleableError(err.message, { cause: err });
          handleError(handleableError, res, sendApiMessageResponse, next);
        },
      );

      this.server = this.expressApp.listen(
        environment.developer.port,
        environment.developer.host,
        () => {
          this._ready = true;
          debugLog(
            environment.developer.debug,
            'log',
            `[ ready ] http://${environment.developer.host}:${environment.developer.port}`,
          );
        },
      );
    } catch (err) {
      console.error('Failed to start the application:', err);
      process.exit(1);
    }
  }

  /**
   * Stop the application
   */
  public async stop(): Promise<void> {
    if (this.server) {
      debugLog(
        environment.developer.debug,
        'log',
        '[ stopping ] Application server',
      );
      await new Promise<void>((resolve, reject) => {
        this.server.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      this.server = null;
    }

    if (this.db) {
      await this.db.disconnect();
      this._db = undefined;
    }

    this._ready = false;
    debugLog(
      environment.developer.debug,
      'log',
      '[ stopped ] Application server and database connections',
    );
  }

  public getModel: GetModelFunction = <T extends IBaseDocument<any>>(
    modelName: string,
  ): Model<T> => {
    return this.db.connection.model<T>(modelName);
  };
}
