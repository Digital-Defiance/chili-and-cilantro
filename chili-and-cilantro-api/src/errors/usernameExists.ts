export class UsernameExistsError extends Error {
  public readonly username: string;
  constructor(username: string) {
    super('Username already exists');
    this.username = username;
    this.name = 'UsernameExistsError';
  }
}
