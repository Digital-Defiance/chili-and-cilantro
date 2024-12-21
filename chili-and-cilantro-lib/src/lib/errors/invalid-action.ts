import { CardType } from '../enumerations/card-type';
import { StringNames } from '../enumerations/string-names';
import { TranslatableEnumType } from '../enumerations/translatable-enum';
import { TurnAction } from '../enumerations/turn-action';
import { translate, translateEnum } from '../i18n';
import { ValidationError } from './validation-error';

export class InvalidActionError extends ValidationError {
  constructor(action: TurnAction, amount?: number, ingredient?: CardType) {
    const amountString = amount ? amount.toString() : '';
    const ingredientString = ingredient
      ? translateEnum({
          type: TranslatableEnumType.CardType,
          value: ingredient,
        })
      : '';
    const invalidAction = translate(StringNames.Error_InvalidAction);
    const actionString = translateEnum({
      type: TranslatableEnumType.TurnAction,
      value: action,
    });
    if (action === TurnAction.Bid || action === TurnAction.IncreaseBid) {
      super(`${invalidAction}: ${actionString} - ${amountString}`);
    } else if (action === TurnAction.PlaceCard) {
      super(`${invalidAction}: ${actionString} - ${ingredientString}`);
    } else if (action === TurnAction.Pass) {
      super(`${invalidAction}: ${actionString}`);
    } else {
      throw new Error(
        translate(StringNames.Error_UnexpectedTurnActionTemplate, undefined, {
          TURN_ACTION: `${action}`,
        }),
      );
    }
    this.name = 'InvalidActionError';
    Object.setPrototypeOf(this, InvalidActionError.prototype);
  }
}
