/**
 * Length of game codes eg "ABCDE"
 */
export const GAME_CODE_LENGTH = 5;

/**
 * Maximum number of chefs in a game
 */
export const MAX_CHEFS = 8;
/**
 * Minimum number of chefs in a game
 */
export const MIN_CHEFS = 3;

/**
 * Maximum length of a game password
 */
export const MAX_GAME_PASSWORD_LENGTH = 30;
/**
 * Minimum length of a game password
 */
export const MIN_GAME_PASSWORD_LENGTH = 3;

/**
 * Maximum length of a game name
 */
export const MAX_GAME_NAME_LENGTH = 255;
/**
 * Minimum length of a game name
 */
export const MIN_GAME_NAME_LENGTH = 2;

/**
 * Maximum length of a username
 */
export const MAX_USERNAME_LENGTH = 30;
/**
 * Minimum length of a username
 */
export const MIN_USERNAME_LENGTH = 3;

/**
 * Maximum length of a user display name
 */
export const MAX_USER_DISPLAY_NAME_LENGTH = 255;
/**
 * Minimum length of a user display name
 */
export const MIN_USER_DISPLAY_NAME_LENGTH = 2;

/**
 * Maximum age of a game without activity in minutes
 */
export const MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES = 60;

/**
 * Maximum length of a password
 */
export const MAX_PASSWORD_LENGTH = 255;
/**
 * Minimum length of a password
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Maximum length of a game message
 */
export const MAX_MESSAGE_LENGTH = 512;
/**
 * Minimum length of a game message
 */
export const MIN_MESSAGE_LENGTH = 2;

/**
 * Regular expression to look for multilingual strings
 */
export const MULTILINGUAL_STRING_REGEX = /^[\s\p{N}\p{L}_-]+$/u;

/**
 * Number of cards in a hand
 */
export const HAND_SIZE = 4;
/**
 * Number of chilis in a hand
 */
export const CHILI_PER_HAND = 1;
/**
 * Number of rounds to win the game
 */
export const ROUNDS_TO_WIN = 2;

/**
 * Represents a value that is not set
 */
export const NONE = -1;

/**
 * Number of bcrypt rounds to hash passwords
 */
export const BCRYPT_ROUNDS = 10;

/**
 * Algorithm to use for JWT
 */
export const JWT_ALGO:
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512' = 'HS256';

/**
 * The expiration time for a JWT token in seconds
 */
export const JWT_EXPIRATION = 86400;

/**
 * The address from which to send emails.
 */
export const EMAIL_FROM = 'noreply@chilicilantro.com';

/**
 * The name of the application.
 */
export const APPLICATION_NAME = 'Chili and Cilantro';

/**
 * Duration in milliseconds for which an email token is valid.
 */
export const EMAIL_TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;
/**
 * Length in bytes of the email token generated (is represented as a hex string of twice as many)
 */
export const EMAIL_TOKEN_LENGTH = 32;

/**
 * The regular expression for valid email addresses.
 */
export const EMAIL_TOKEN_RESEND_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * The regular expression for valid usernames.
 */
export const USERNAME_REGEX = /^[A-Za-z0-9]{3,30}$/;
/**
 * The error message for invalid usernames.
 */
export const USERNAME_REGEX_ERROR =
  'Username must be 3-30 characters long and contain only letters and numbers';
/**
 * The regular expression for valid passwords.
 */
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;
/**
 * The error message for invalid passwords.
 */
export const PASSWORD_REGEX_ERROR =
  'Password must be at least 8 characters long and include at least one letter, one number, and one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)';

export default {
  BCRYPT_ROUNDS,
  CHILI_PER_HAND,
  EMAIL_TOKEN_RESEND_INTERVAL,
  GAME_CODE_LENGTH,
  JWT_ALGO,
  JWT_EXPIRATION,
  MAX_CHEFS,
  MIN_CHEFS,
  MAX_GAME_PASSWORD_LENGTH,
  MIN_GAME_PASSWORD_LENGTH,
  MAX_GAME_NAME_LENGTH,
  MIN_GAME_NAME_LENGTH,
  HAND_SIZE,
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  MAX_USER_DISPLAY_NAME_LENGTH,
  MIN_USER_DISPLAY_NAME_LENGTH,
  MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  MULTILINGUAL_STRING_REGEX,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  ROUNDS_TO_WIN,
  USERNAME_REGEX,
  USERNAME_REGEX_ERROR,
  NONE: NONE,
};
