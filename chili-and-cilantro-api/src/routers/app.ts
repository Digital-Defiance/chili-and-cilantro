import {
  debugLog,
  StringNames,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  handleError,
  sendApiMessageResponse,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { randomBytes } from 'crypto';
import ejs from 'ejs';
import {
  Application,
  static as expressStatic,
  Request,
  Response,
} from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { environment } from '../environment';
import { ApiRouter } from './api';

function keepEJS() {
  ejs.compile(''); // Compile an empty string, doesn't generate anything meaningful
}

/**
 * Application router
 * Sets up the API and static file serving
 */
export class AppRouter {
  private static readonly viewsPath = join(__dirname, '..', 'views');
  private static readonly distPath = join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'chili-and-cilantro-react',
  );
  private static readonly indexPath = join(AppRouter.distPath, 'index.html');
  private readonly apiRouter: ApiRouter;

  constructor(apiRouter: ApiRouter) {
    this.apiRouter = apiRouter;
  }

  /**
   * Initialize the application router
   * @param app The application
   * @param debugRoutes Whether to log routes to the console
   */
  public init(app: Application) {
    if (!AppRouter.distPath.includes('/dist/')) {
      throw new Error(
        `App does not appear to be running within dist: ${AppRouter.distPath}`,
      );
    }
    if (!existsSync(AppRouter.indexPath)) {
      throw new Error(`Index file not found: ${AppRouter.indexPath}`);
    }

    if (environment.developer.debug) {
      app.use((req, res, next) => {
        console.log(`Serving route: ${req.method} ${req.url}`);
        next();
      });
    }

    app.use('/api', this.apiRouter.router);

    app.set('views', AppRouter.viewsPath);
    app.set('view engine', 'ejs');

    // Serve static files from the React app build directory
    // app.use(express.static(path.join(__dirname, '..', '..', '..', 'chili-and-cilantro-react')));
    const serveStaticWithLogging = expressStatic(AppRouter.distPath);
    app.use('/static/js', expressStatic(AppRouter.distPath));
    app.use((req, res, next) => {
      if (req.url === '/') {
        next();
        return;
      }
      debugLog(
        environment.developer.debug,
        'log',
        `Trying to serve static for ${req.url}`,
      );
      if (req.url.endsWith('.js')) {
        res.type('application/javascript');
      }
      serveStaticWithLogging(req, res, (err) => {
        if (err) {
          debugLog(
            environment.developer.debug,
            'error',
            'Error serving static file:',
            err,
          );
          handleError(err, res, sendApiMessageResponse, next);
          return;
        }
        next();
      });
    });

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req: Request, res: Response) => {
      const cspNonce = randomBytes(32).toString('hex');
      const title = translate(StringNames.Common_Site);
      if (req.url.endsWith('.js')) {
        res.type('application/javascript');
      }

      res.render(
        'index',
        {
          cspNonce,
          title,
          siteUrl: environment.siteUrl,
          baseHref: environment.basePath,
          pusherVersion: environment.developer.pusherVersion,
          fontawesomeKitId: environment.developer.fontawesomeKitId,
        },
        (err, html) => {
          // Render 'index.ejs'
          if (err) {
            console.error('Error rendering:', err);
            if (!res.headersSent) {
              res.status(500).send('An error occurred'); // Send a generic error message or render a separate error view
            }
            return;
          }
          res.send(html);
        },
      );
    });
  }
}
