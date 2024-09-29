export interface IEnvironment {
  production: boolean;
  game: {
    apiUrl: string;
    socketHost: string;
  };
}
