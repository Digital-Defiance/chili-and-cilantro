import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { config } from 'dotenv';
import { join, resolve } from 'path';
import { IEnvironment } from './interfaces/environment';

// Load .env file from the root directory
config({ path: resolve(__dirname, '../../.env') });

/**
 * Finds the path to the dist folder using the current filename
 */
function relativeToDist(...inputPath: string[]): string {
  const fullPath = __filename;
  const pathParts = fullPath.split('/');
  const distIndex = pathParts.indexOf('dist');
  if (distIndex === -1) {
    throw new Error('Could not find dist folder');
  }
  const pathToDist = pathParts.slice(0, distIndex + 1).join('/');
  return join(pathToDist, ...inputPath);
}

const host = process.env.SERVER_HOST ?? 'localhost';
const port = Number(process.env.PORT ?? 3000);
const production = process.env.NODE_ENV === 'production';
const sslEnabled = process.env.SSL_ENABLED === 'true';
const reactDistDir =
  process.env['REACT_DIST_DIR'] ?? relativeToDist('chili-and-cilantro-react');

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
  basePath: process.env.BASE_PATH ?? '/',
  jwtSecret: process.env.JWT_SECRET ?? 'Ch1l!&C1l@ntr0',
  sendgridKey: process.env.SENDGRID_API_KEY ?? '',
  emailSender: process.env.EMAIL_SENDER ?? constants.EMAIL_FROM,
  developer: {
    debug: process.env.DEBUG === 'true',
    reactDistDir: reactDistDir,
    host: host,
    port: port,
    sslEnabled: sslEnabled,
    corsOrigin: process.env.CORS_ORIGIN ?? getSiteUrl(),
    pusherVersion: process.env.PUSHER_VERSION ?? '8.2.0',
    fontawesomeKitId: process.env.FONTAWESOME_KIT_ID ?? '',
  },
  mongo: {
    uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/chilicilantro',
    useTransactions: process.env.USE_TRANSACTIONS === 'true',
  },
  cookies: {
    enabled: process.env.COOKIE_ENABLED === 'true',
    /**
     * arbitrarily generated string, arbitrarily 100 characters long
     */
    secret: process.env.EXPRESS_SESSION_SECRET ?? '',
  },
  pusher: {
    appId: process.env.PUSHER_APP_ID ?? '',
    key: process.env.PUSHER_KEY ?? '',
    secret: process.env.PUSHER_SECRET ?? '',
    cluster: process.env.PUSHER_CLUSTER ?? '',
  },
};
