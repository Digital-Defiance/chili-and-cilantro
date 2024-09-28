import { CardType } from '../enumerations/card-type';
import { ValidationError } from './validation-error';

export class OutOfIngredientError extends ValidationError {
  constructor(ingredient: CardType) {
    super(`Not enough of that ingredient. (${ingredient})`);
    Object.setPrototypeOf(this, OutOfIngredientError.prototype);
  }
}
