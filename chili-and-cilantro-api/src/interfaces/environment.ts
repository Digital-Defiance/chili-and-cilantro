export interface IEnvironment {
  production: boolean;
  siteUrl: string;
  jwtSecret: string;
  sendgridKey: string;
  developer: {
    reactDir: string;
    host: string;
    port: number;
    sslEnabled: boolean;
    corsOrigin: string;
  };
  mongo: {
    uri: string;
  };
  cookies: {
    enabled: boolean;
    secret: string;
  };
}

export function validateEnvironment(
  environment: IEnvironment,
  then: (environment: IEnvironment) => void,
) {
  // ensure all required environment variables are set
  if (!environment.cookies.secret) {
    throw new Error('EXPRESS_SESSION_SECRET is not set');
  }
  if (!environment.mongo.uri) {
    throw new Error('MONGO_URI is not set');
  }
  then(environment);
}
