import { ChallengeResponse } from '../enumerations/challenge-response';
import { StringLanguages } from '../enumerations/string-languages';
import { ChallengeResponseLanguageTranslation } from './challenge-response';

export const ChallengeResponsePastTenseTranslations: ChallengeResponseLanguageTranslation =
  {
    [StringLanguages.EnglishUS]: {
      [ChallengeResponse.accept]: 'Accepted',
      [ChallengeResponse.concede]: 'Conceded',
      [ChallengeResponse.counter]: 'Countered',
      [ChallengeResponse.prove]: 'Proved',
    },
    [StringLanguages.EnglishUK]: {
      [ChallengeResponse.accept]: 'Accepted',
      [ChallengeResponse.concede]: 'Conceded',
      [ChallengeResponse.counter]: 'Countered',
      [ChallengeResponse.prove]: 'Proved',
    },
    [StringLanguages.French]: {
      [ChallengeResponse.accept]: 'Accepté',
      [ChallengeResponse.concede]: 'Concédé',
      [ChallengeResponse.counter]: 'Contre',
      [ChallengeResponse.prove]: 'Prouvé',
    },
    [StringLanguages.MandarinChinese]: {
      [ChallengeResponse.accept]: '接受',
      [ChallengeResponse.concede]: '让步',
      [ChallengeResponse.counter]: '对',
      [ChallengeResponse.prove]: '证明',
    },
    [StringLanguages.Spanish]: {
      [ChallengeResponse.accept]: 'Aceptado',
      [ChallengeResponse.concede]: 'Concedido',
      [ChallengeResponse.counter]: 'Contraatacado',
      [ChallengeResponse.prove]: 'Demostrado',
    },
    [StringLanguages.Ukrainian]: {
      [ChallengeResponse.accept]: 'Прийнято',
      [ChallengeResponse.concede]: 'Уступити',
      [ChallengeResponse.counter]: 'Проти',
      [ChallengeResponse.prove]: 'Доведено',
    },
  };
