import { IEnvironment } from '../interfaces/environment';

export const environment: IEnvironment = {
  production: false,
  game: {
    apiUrl: 'http://localhost:3000/api',
    socketHost: 'http://localhost:3000',
  },
};
