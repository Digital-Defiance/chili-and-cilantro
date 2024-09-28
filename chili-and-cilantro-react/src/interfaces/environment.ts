export interface IEnvironment {
  production: boolean;
  debugI18n: boolean;
  game: {
    apiUrl: string;
    socketHost: string;
  };
}
