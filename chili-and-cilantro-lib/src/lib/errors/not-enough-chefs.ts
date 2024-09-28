export class NotEnoughChefsError extends Error {
  constructor(present: number, minChefs: number) {
    super(
      `Not enough chefs to start game. ${present}/${minChefs}`,
    );
    Object.setPrototypeOf(this, NotEnoughChefsError.prototype);
  }
}
