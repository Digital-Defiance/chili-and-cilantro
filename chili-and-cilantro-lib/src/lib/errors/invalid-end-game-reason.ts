import { EndGameReason } from '../enumerations/end-game-reason';
import { StringNames } from '../enumerations/string-names';
import { TranslatableEnumType } from '../enumerations/translatable-enum';
import { translate, translateEnum } from '../i18n';
import { HandleableError } from './handleable-error';

export class InvalidEndGameReasonError extends HandleableError {
  public readonly reason: EndGameReason;
  constructor(reason: EndGameReason) {
    super(
      `${translate(StringNames.Error_InvalidEndGameReason)}: ${translateEnum({ type: TranslatableEnumType.EndGameReason, value: reason })}`,
      { statusCode: 422 },
    );
    this.reason = reason;
  }
}
