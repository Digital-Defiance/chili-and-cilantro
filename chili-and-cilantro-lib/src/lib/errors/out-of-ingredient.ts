import { CardType } from '../enumerations/card-type';
import { StringNames } from '../enumerations/string-names';
import { TranslatableEnumType } from '../enumerations/translatable-enum';
import { translate, translateEnum } from '../i18n';
import { ValidationError } from './validation-error';

export class OutOfIngredientError extends ValidationError {
  constructor(ingredient: CardType) {
    const ingredientString = translateEnum({
      type: TranslatableEnumType.CardType,
      value: ingredient,
    });
    super(
      translate(StringNames.Error_OutOfIngredientTemplate, undefined, {
        INGREDIENT: ingredientString,
      }),
    );
    this.name = 'OutOfIngredientError';
    Object.setPrototypeOf(this, OutOfIngredientError.prototype);
  }
}
