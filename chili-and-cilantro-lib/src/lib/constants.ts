/**
 * Length of game codes eg "ABCDE"
 */
export const GAME_CODE_LENGTH = 5;

/**
 * Regular expression for game codes
 */
export const GAME_CODE_REGEX = new RegExp(`^[A-Z]{${GAME_CODE_LENGTH}}$`);

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
export const MIN_GAME_PASSWORD_LENGTH = 1;

/**
 * Game passwords can be much simpler, but still need to allow multilingual characters
 */
export const GAME_PASSWORD_REGEX = new RegExp(
  `^[\\p{L}\\p{M}\\p{Nd}\\p{Pc}\\p{Zs}]{${MIN_GAME_PASSWORD_LENGTH},${MAX_GAME_PASSWORD_LENGTH}}$`,
  'u',
);

/**
 * Maximum length of a game name
 */
export const MAX_GAME_NAME_LENGTH = 255;
/**
 * Minimum length of a game name
 */
export const MIN_GAME_NAME_LENGTH = 2;

export const GAME_NAME_REGEX = new RegExp(
  `^[\\p{L}\\p{M}\\p{Nd}\\p{Pc}\\p{Zs}]{${MIN_GAME_NAME_LENGTH},${MAX_GAME_NAME_LENGTH}}$`,
  'u',
);

export const GAME_NAME_REGEX_ERROR = `Game name must be between ${MIN_GAME_NAME_LENGTH} and ${MAX_GAME_NAME_LENGTH} characters long`;

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
export const MIN_USER_DISPLAY_NAME_LENGTH = 1;

const createUserDisplayNameRegex = (minLength: number, maxLength: number) => {
  return new RegExp(
    `^[\\p{L}\\p{M}\\p{Nd}\\p{Pc}\\p{Zs}]{${minLength},${maxLength}}$`,
    'u',
  );
};

export const USER_DISPLAY_NAME_REGEX = createUserDisplayNameRegex(
  MIN_USER_DISPLAY_NAME_LENGTH,
  MAX_USER_DISPLAY_NAME_LENGTH,
);

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
export const MIN_MESSAGE_LENGTH = 1;

export const MESSAGE_REGEX = new RegExp(
  `^[\\p{L}\\p{M}\\p{Nd}\\p{Pc}\\p{Zs}]{${MIN_MESSAGE_LENGTH},${MAX_MESSAGE_LENGTH}}$`,
  'u',
);

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
export const JWT_EXPIRATION_SEC = 86400;

/**
 * The domain of the site
 */
export const SITE_DOMAIN = 'chilicilantro.com';

/**
 * The address from which to send emails.
 */
export const EMAIL_FROM = `noreply@${SITE_DOMAIN}`;

/**
 * The name of the application.
 */
export const APPLICATION_NAME = 'Chili & Cilantro';

/**
 * Duration in milliseconds for which an email token is valid, in minutes
 */
export const EMAIL_TOKEN_EXPIRATION_MIN = 15;
/**
 * Duration in milliseconds for which an email token is valid, in seconds
 */
export const EMAIL_TOKEN_EXPIRATION_SEC = EMAIL_TOKEN_EXPIRATION_MIN * 60;
/**
 * Duration in milliseconds for which an email token is valid, in milliseconds
 */
export const EMAIL_TOKEN_EXPIRATION_MS = EMAIL_TOKEN_EXPIRATION_SEC * 1000;

/**
 * Length in bytes of the email token generated (is represented as a hex string of twice as many)
 */
export const EMAIL_TOKEN_LENGTH = 32;

/**
 * The regular expression for valid email addresses, in minutes.
 */
export const EMAIL_TOKEN_RESEND_INTERVAL_MINS = 15;
/**
 * The regular expression for valid email addresses, in seconds.
 */
export const EMAIL_TOKEN_RESEND_INTERVAL_SEC =
  EMAIL_TOKEN_RESEND_INTERVAL_MINS * 60;
/**
 * The regular expression for valid email addresses, in milliseconds.
 */
export const EMAIL_TOKEN_RESEND_INTERVAL_MS =
  EMAIL_TOKEN_RESEND_INTERVAL_SEC * 1000;

const createUsernameRegex = (minLength: number, maxLength: number) => {
  return new RegExp(
    `^[\\p{L}\\p{M}\\p{Nd}][\\p{L}\\p{M}\\p{Nd}_-]{${minLength - 1},${maxLength - 1}}$`,
    'u',
  );
};
/**
 * The regular expression for valid usernames.
 */
export const USERNAME_REGEX = createUsernameRegex(
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
);

const createPasswordRegex = (minLength: number, maxLength: number) => {
  return new RegExp(
    `^(?=.*\\p{Ll})(?=.*\\p{Lu})(?=.*\\p{Nd})(?=.*[\\p{P}\\p{S}])[\\p{L}\\p{M}\\p{Nd}\\p{P}\\p{S}]{${minLength},${maxLength}}$`,
    'u',
  );
};
/**
 * The regular expression for valid passwords.
 */
export const PASSWORD_REGEX = createPasswordRegex(
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
);

export default {
  BCRYPT_ROUNDS,
  CHILI_PER_HAND,
  EMAIL_FROM,
  EMAIL_TOKEN_RESEND_INTERVAL_MS,
  GAME_CODE_LENGTH,
  GAME_CODE_REGEX,
  JWT_ALGO,
  JWT_EXPIRATION_SEC,
  MAX_CHEFS,
  MIN_CHEFS,
  MAX_GAME_PASSWORD_LENGTH,
  MIN_GAME_PASSWORD_LENGTH,
  GAME_PASSWORD_REGEX,
  MAX_GAME_NAME_LENGTH,
  MIN_GAME_NAME_LENGTH,
  GAME_NAME_REGEX,
  GAME_NAME_REGEX_ERROR,
  HAND_SIZE,
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
  MESSAGE_REGEX,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  MAX_USER_DISPLAY_NAME_LENGTH,
  MIN_USER_DISPLAY_NAME_LENGTH,
  USER_DISPLAY_NAME_REGEX,
  MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  MULTILINGUAL_STRING_REGEX,
  PASSWORD_REGEX,
  ROUNDS_TO_WIN,
  USERNAME_REGEX,
  SITE_DOMAIN,
  NONE,
};
