import { BaseError } from './base-error';
export class NotEnoughChefsError extends BaseError {
  constructor(present: number, minChefs: number) {
    super(
      `Not enough chefs to start game. ${present}/${minChefs}`,
      'NotEnoughChefs',
    );
  }
}
