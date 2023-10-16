import cors from 'cors';
import { Application, json as expressJson, urlencoded } from 'express';
//import { auth } from 'express-oauth2-jwt-bearer';
import helmet from 'helmet';
import { json } from 'body-parser';
import logger from 'morgan';
import nocache from 'nocache';
import compression from 'compression';
import { cors as corslib } from './cors';
import { environment } from './environment';

export function setupMiddlewares(app: Application) {
  app.use(corslib);
  app.use(compression());
  app.use(json());
  // app.use(auth({
  //   issuerBaseURL: `https://${environment.auth0.domain}/`,
  //   audience: environment.auth0.audience,
  //   tokenSigningAlg: 'RS256',
  // }));
  app.use(expressJson());
  app.use(logger('dev'));
  app.use(urlencoded({ extended: true }));
  app.use(
    helmet({
      hsts: {
        maxAge: 31536000,
      },
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'https://cdn.auth0.com', 'https://s.gravatar.com'],
          connectSrc: ["'self'", `https://${environment.auth0.domain}/`],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          frameSrc: ["'self'", `https://${environment.auth0.domain}/`],
        },
      },
      frameguard: {
        action: 'deny',
      },
    }),
  );
  app.use(nocache());
  app.use(
    cors({
      origin: environment.siteUrl,
      methods: ['GET'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      maxAge: 86400,
    }),
  );
}
