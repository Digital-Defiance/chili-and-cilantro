export interface IEnvironment {
  production: boolean;
  auth0: {
    domain: string;
    clientId: string;
    audience: string;
    callbackUrl: string;
  };
}
