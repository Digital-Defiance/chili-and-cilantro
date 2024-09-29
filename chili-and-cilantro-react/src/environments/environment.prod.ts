import { IEnvironment } from '../interfaces/environment';

export const environment: IEnvironment = {
  production: true,
  debugI18n: false,
  game: {
    apiUrl: 'http://localhost:3000/api',
    socketHost: 'http://localhost:3000',
  },
};
