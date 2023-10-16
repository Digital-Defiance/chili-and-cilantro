import 'dotenv/config';
import { join } from 'path';
import { IEnvironment } from './interfaces/environment';

/**
 * Finds the path to the dist folder using the current filename
 */
function relativeToDist(...inputPath: string[]): string {
  const fullPath = __filename;
  const pathParts = fullPath.split('/');
  const distIndex = pathParts.indexOf('dist');
  const pathToDist = pathParts.slice(0, distIndex + 1).join('/');
  return join(pathToDist, ...inputPath);
}

const host = process.env.SERVER_HOST ?? 'localhost';
const port = Number(process.env.PORT ?? 3000);
const production = process.env.NODE_ENV === 'production';
const sslEnabled = process.env.SSL_ENABLED === 'true';
const reactDir = relativeToDist('chili-and-cilantro-react');

function getSiteUrl() {
  const proto = sslEnabled ? 'https' : 'http';
  if (sslEnabled && port === 443) {
    return `${proto}://${host}`;
  } else if (!sslEnabled && port === 80) {
    return `${proto}://${host}`;
  } else {
    return `${proto}://${host}:${port}`;
  }
}

export const environment: IEnvironment = {
  production: production,
  siteUrl: process.env.SITE_URL ?? getSiteUrl(),
  developer: {
    reactDir: reactDir,
    host: host,
    port: port,
    sslEnabled: sslEnabled,
  },
  auth0: {
    database: process.env.AUTH0_DATABASE ?? '',
    domain: process.env.AUTH0_DOMAIN ?? '',
    clientId: process.env.AUTH0_CLIENT_ID ?? '',
    clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
    scope: process.env.AUTH0_SCOPE ?? '',
    audience: process.env.AUTH0_AUDIENCE ?? '',
  },
  mongo: {
    uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/chilicilantro',
  },
  cookies: {
    enabled: process.env.COOKIE_ENABLED === 'true',
    /**
     * arbitrarily generated string, arbitrarily 100 characters long
     */
    secret: process.env.EXPRESS_SESSION_SECRET ?? '',
  },
};
