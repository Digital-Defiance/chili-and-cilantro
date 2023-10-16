export interface IEnvironment {
  production: boolean;
  siteUrl: string;
  developer: {
    reactDir: string;
    host: string;
    port: number;
    sslEnabled: boolean;
  };
  auth0: {
    database: string;
    domain: string;
    clientId: string;
    clientSecret: string;
    scope: string;
    audience: string;
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
