import { ChallengeResponse } from '../enumerations/challenge-response';
import { StringLanguages } from '../enumerations/string-languages';

export type ChallengeResponseTranslation = {
  [key in ChallengeResponse]: string;
};
export type ChallengeResponseLanguageTranslation = {
  [key in StringLanguages]: ChallengeResponseTranslation;
};

export const ChallengeResponseTranslations: ChallengeResponseLanguageTranslation =
  {
    [StringLanguages.EnglishUS]: {
      [ChallengeResponse.accept]: 'Accept',
      [ChallengeResponse.concede]: 'Concede',
      [ChallengeResponse.counter]: 'Counter',
      [ChallengeResponse.prove]: 'Prove',
    },
    [StringLanguages.EnglishUK]: {
      [ChallengeResponse.accept]: 'Accept',
      [ChallengeResponse.concede]: 'Concede',
      [ChallengeResponse.counter]: 'Counter',
      [ChallengeResponse.prove]: 'Prove',
    },
    [StringLanguages.French]: {
      [ChallengeResponse.accept]: 'Accepter',
      [ChallengeResponse.concede]: 'Concéder',
      [ChallengeResponse.counter]: 'Contre',
      [ChallengeResponse.prove]: 'Prouver',
    },
    [StringLanguages.MandarinChinese]: {
      [ChallengeResponse.accept]: '接受',
      [ChallengeResponse.concede]: '让步',
      [ChallengeResponse.counter]: '对',
      [ChallengeResponse.prove]: '证明',
    },
    [StringLanguages.Spanish]: {
      [ChallengeResponse.accept]: 'Aceptar',
      [ChallengeResponse.concede]: 'Conceder',
      [ChallengeResponse.counter]: 'Contra',
      [ChallengeResponse.prove]: 'Probar',
    },
    [StringLanguages.Ukrainian]: {
      [ChallengeResponse.accept]: 'Приймати',
      [ChallengeResponse.concede]: 'Уступити',
      [ChallengeResponse.counter]: 'Проти',
      [ChallengeResponse.prove]: 'Довести',
    },
  };
