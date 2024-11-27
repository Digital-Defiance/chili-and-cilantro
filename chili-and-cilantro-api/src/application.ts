import {
  GetModelFunction,
  IBaseDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  getSchemaMap,
  IApplication,
  SchemaMap,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import express, { Application, Request, Response } from 'express';
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
  private _appRouter: AppRouter | undefined;
  public get appRouter(): AppRouter {
    if (!this._appRouter) {
      throw new Error('appRouter is not loaded yet. call start() first');
    }
    return this._appRouter;
  }
  private _apiRouter: ApiRouter | undefined;
  public get apiRouter(): ApiRouter {
    if (!this._apiRouter) {
      throw new Error('apiRouter is not loaded yet. call start() first');
    }
    return this._apiRouter;
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
  public async start(mongoUri?: string, debug = true): Promise<void> {
    const mongo_uri = mongoUri ?? environment.mongo.uri;
    try {
      if (this._ready) {
        console.error(
          'Failed to start the application:',
          'Application is already running',
        );
        process.exit(1);
      }
      if (debug) console.log('[ connecting ] MongoDB', mongo_uri);
      this._db = await connect(mongo_uri);
      connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      connection.on('disconnected', () => {
        if (debug) console.log('MongoDB disconnected');
      });

      await new Promise<void>((resolve) => {
        if (connection.readyState === 1) {
          resolve();
        } else {
          connection.once('connected', resolve);
        }
      });
      if (debug) console.log('[ connected ] MongoDB');

      if (debug) console.log('[ loading ] Schemas');
      this._schemaMap = getSchemaMap(this.db.connection);

      if (debug) {
        Object.values(this._schemaMap).forEach((schema) => {
          console.log(`[ loaded ] schema '${schema.name}'`);
        });
      }

      // init all middlewares and routes
      Middlewares.init(this.expressApp);
      this._apiRouter = new ApiRouter(this.getModel, this.db.connection);
      this._appRouter = new AppRouter(this._apiRouter);
      this._appRouter.init(this.expressApp, debug);
      // if none of the above handle the request, pass it to error handler
      this.expressApp.use((err: Error, req: Request, res: Response) => {
        console.error('Unhandled error:', err);
        res.status(500).send('Internal Server Error');
      });

      this.server = this.expressApp.listen(
        environment.developer.port,
        environment.developer.host,
        () => {
          this._ready = true;
          if (debug)
            console.log(
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
  public async stop(debug = true): Promise<void> {
    if (this.server) {
      if (debug) console.log('[ stopping ] Application server');
      await new Promise<void>((resolve, reject) => {
        this.server!.close((err) => {
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
    if (debug)
      console.log('[ stopped ] Application server and database connections');
  }

  public getModel: GetModelFunction = <T extends IBaseDocument<any>>(
    modelName: string,
  ): Model<T> => {
    return this.db.connection.model<T>(modelName);
  };
}
