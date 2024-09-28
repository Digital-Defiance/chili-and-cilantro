import { EmailTokenType } from '../enumerations/email-token-type';
import { StringLanguages } from '../enumerations/string-languages';

export type EmailTokenTypeTranslation = {
  [key in EmailTokenType]: string;
};
export type EmailTokenTypeLanguageTranslation = {
  [key in StringLanguages]: EmailTokenTypeTranslation;
};

export const EmailTokenTypeTranslations: EmailTokenTypeLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [EmailTokenType.AccountVerification]: 'Account Verification',
    [EmailTokenType.PasswordReset]: 'Password Reset',
  },
  [StringLanguages.EnglishUK]: {
    [EmailTokenType.AccountVerification]: 'Account Verification',
    [EmailTokenType.PasswordReset]: 'Password Reset',
  },
  [StringLanguages.French]: {
    [EmailTokenType.AccountVerification]: 'Vérification de compte',
    [EmailTokenType.PasswordReset]: 'Réinitialisation de mot de passe',
  },
  [StringLanguages.MandarinChinese]: {
    [EmailTokenType.AccountVerification]: '帐户验证',
    [EmailTokenType.PasswordReset]: '重置密码',
  },
  [StringLanguages.Spanish]: {
    [EmailTokenType.AccountVerification]: 'Verificación de cuenta',
    [EmailTokenType.PasswordReset]: 'Restablecer contraseña',
  },
  [StringLanguages.Ukrainian]: {
    [EmailTokenType.AccountVerification]: 'Верифікація облікового запису',
    [EmailTokenType.PasswordReset]: 'Скидання пароля',
  },
};
