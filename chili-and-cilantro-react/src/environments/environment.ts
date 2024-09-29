import { IEnvironment } from '../interfaces/environment';

export const environment: IEnvironment = {
  production: false,
  debugI18n: true,
  game: {
    apiUrl: 'http://localhost:3000/api',
    socketHost: 'http://localhost:3000',
  },
};
