import { CardType } from "chili-and-cilantro-lib/src/lib/enumerations/cardType";
import { ValidationError } from "./validationError";

export class OutOfIngredientError extends ValidationError {
  constructor(ingredient: CardType) {
    super(`Not enough of that ingredient. (${ingredient})`, 'ingredient');
  }
}