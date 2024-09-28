import { CardType } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ValidationError } from './validation-error';

export class OutOfIngredientError extends ValidationError {
  constructor(ingredient: CardType) {
    super(`Not enough of that ingredient. (${ingredient})`);
    Object.setPrototypeOf(this, OutOfIngredientError.prototype);
  }
}
