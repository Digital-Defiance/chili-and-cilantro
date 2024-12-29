export interface IEnvironment {
  production: boolean;
  debugI18n: boolean;
  game: {
    siteUrl: string;
    apiUrl: string;
    socketHost: string;
  };
}
