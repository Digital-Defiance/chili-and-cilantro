export interface IEnvironment {
  production: boolean;
  siteUrl: string;
  basePath: string;
  emailSender: string;
  jwtSecret: string;
  sendgridKey: string;
  developer: {
    debug: boolean;
    reactDistDir: string;
    host: string;
    port: number;
    sslEnabled: boolean;
    corsOrigin: string;
    pusherVersion: string;
    fontawesomeKitId: string;
  };
  mongo: {
    uri: string;
    useTransactions: boolean;
  };
  cookies: {
    enabled: boolean;
    secret: string;
  };
  pusher: {
    appId: string;
    key: string;
    secret: string;
    cluster: string;
  };
}

export function validateEnvironment(
  environment: IEnvironment,
  then: () => void,
) {
  // ensure all required environment variables are set
  if (!environment.developer.host) {
    throw new Error('HOST is not set');
  }
  if (!environment.developer.port) {
    throw new Error('PORT is not set');
  }
  if (!environment.siteUrl) {
    throw new Error('SITE_URL is not set');
  }
  if (!environment.jwtSecret) {
    throw new Error('JWT_SECRET is not set');
  }
  if (!environment.mongo.uri) {
    throw new Error('MONGO_URI is not set');
  }
  if (!environment.sendgridKey) {
    throw new Error('SENDGRID_API_KEY is not set');
  }
  if (!environment.sendgridKey.startsWith('SG')) {
    throw new Error(
      `SENDGRID_API_KEY does not start with "SG": ${environment.sendgridKey}`,
    );
  }
  if (!environment.emailSender) {
    throw new Error('EMAIL_SENDER is not set');
  }
  then();
}
