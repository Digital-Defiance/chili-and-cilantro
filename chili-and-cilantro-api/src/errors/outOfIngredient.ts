import { CardType } from "@chili-and-cilantro/chili-and-cilantro-lib";
import { ValidationError } from "./validationError";

export class OutOfIngredientError extends ValidationError {
  constructor(ingredient: CardType) {
    super(`Not enough of that ingredient. (${ingredient})`, 'ingredient');
  }
}