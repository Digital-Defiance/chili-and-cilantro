import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import cors from 'cors';
import { randomBytes } from 'crypto';
import { Application, json, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';

export class Middlewares {
  private static readonly corsWhitelist = [
    'http://localhost:3000',
    'https://localhost:3000',
    `http://${constants.SITE_DOMAIN}`,
    `https://${constants.SITE_DOMAIN}`,
  ];
  private static readonly corsOptionsDelegate = (
    req: cors.CorsRequest,
    callback: (
      error: Error | null,
      options: cors.CorsOptions | undefined,
    ) => void,
  ) => {
    const corsOptions: cors.CorsOptions = {
      origin: (origin, cb) => {
        if (!origin || Middlewares.corsWhitelist.indexOf(origin) !== -1) {
          cb(null, true);
        } else {
          cb(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      maxAge: 86400,
    };
    callback(null, corsOptions);
  };
  public static init(app: Application): void {
    // CSP nonce
    app.use((req, res, next) => {
      res.locals.cspNonce = randomBytes(32).toString('hex');
      next();
    });
    // Helmet helps you secure your Express apps by setting various HTTP headers
    app.use(
      helmet({
        hsts: {
          maxAge: 31536000,
        },
        contentSecurityPolicy: {
          useDefaults: false,
          directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'https://flagcdn.com'],
            connectSrc: ["'self'", 'https://ka-p.fontawesome.com'],
            scriptSrc: [
              "'self'",
              //"'unsafe-inline'",
              'https://kit.fontawesome.com',
              'https://js.pusher.com',
              (req: Request, res: Response) => `'nonce-${res.locals.cspNonce}'`,
              `'sha256-6PKsc2tce3h07DOGUTGAjjPqKvoXMqTLynuHAwpWTL4='`, // fontawesome
              `'sha256-av6jwjxPe2WZrP9CzmEkq2F85ixfGLW5uOadNDWPeEw='`, // pusher
            ],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              'https://fonts.googleapis.com',
            ],
            fontSrc: [
              "'self'",
              'https://fonts.gstatic.com',
              'https://ka-f.fontawesome.com',
            ],
            frameSrc: ["'self'"],
          },
        },
        frameguard: {
          action: 'deny',
        },
      }),
    );
    // Enable CORS
    app.use(cors(Middlewares.corsOptionsDelegate));
    // Parse incoming requests with JSON payloads
    app.use(json());
    // Parse incoming requests with urlencoded payloads
    app.use(urlencoded({ extended: true }));
  }
}
