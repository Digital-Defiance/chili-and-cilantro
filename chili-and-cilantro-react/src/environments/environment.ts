import { IEnvironment } from '../interfaces/environment';

export const environment: IEnvironment = {
  production: false,
  auth0: {
    domain: 'digital-defiance-dev.us.auth0.com',
    clientId: 'nKniP4feafxk1eNVpeWS2N1oJ0uPK9xF',
    audience: 'http://localhost:3000/',
    callbackUrl: 'http://localhost:3000/callback',
  },
  game: {
    apiUrl: 'http://localhost:3000/api',
    socketHost: 'http://localhost:3000',
  },
};
