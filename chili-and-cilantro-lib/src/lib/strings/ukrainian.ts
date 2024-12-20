import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = 'Чілі та Коріандр';

export const UkrainianStrings: StringsCollection = {
  [StringNames.AccountError_Message]:
    'Здається, у вас проблеми з обліковим записом. Будь ласка, зв’яжіться з підтримкою.',
  [StringNames.AccountError_Title]: 'Помилка облікового запису',
  [StringNames.ChangePassword_ChangePasswordButton]: 'Змінити пароль',
  [StringNames.ChangePassword_Success]: 'Пароль успішно змінено',
  [StringNames.Common_ChangePassword]: 'Змінити пароль',
  [StringNames.Common_ConfirmNewPassword]: 'Підтвердити новий пароль',
  [StringNames.Common_CurrentPassword]: 'Поточний пароль',
  [StringNames.Common_Email]: 'Електронна пошта',
  [StringNames.Common_GoToSplash]: 'Повернутися до екрану привітання',
  [StringNames.Common_NewPassword]: 'Новий пароль',
  [StringNames.Common_Dashboard]: 'Панель',
  [StringNames.Common_Loading]: 'Завантаження...',
  [StringNames.Common_Logo]: 'лого',
  [StringNames.Common_MasterChef]: 'Майстер-кухар',
  [StringNames.Common_Password]: 'Пароль',
  [StringNames.Common_ReturnToKitchen]: 'Повернутися на Кухню',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Почати приготування',
  [StringNames.Common_Tagline]: 'Пікантний Блеф',
  [StringNames.Common_TokenValid]: 'Токен діїдженний',
  [StringNames.Common_Unauthorized]: 'Немає авторизації',
  [StringNames.Common_UnexpectedError]: 'Неочікувана помилка',
  [StringNames.Common_Username]: 'Ім’я користувача',
  [StringNames.EmailToken_ExpiresInTemplate]:
    'Посилання дійсне протягом {EMAIL_TOKEN_EXPIRATION_MIN} хвилин.',
  [StringNames.EmailToken_TitleEmailConfirm]: 'Підтвердження електронної пошти',
  [StringNames.EmailToken_TitleResetPassword]: 'Скидання пароля',
  [StringNames.EmailToken_ClickLinkEmailConfirm]:
    'Натисніть на посилання для підтвердження електронної пошти',
  [StringNames.EmailToken_ClickLinkResetPassword]:
    'Натисніть на посилання для скидання пароля',
  [StringNames.Error_AccountStatusIsDeleted]: 'Обліковий запис видалено',
  [StringNames.Error_AccountStatusIsLocked]: 'Обліковий запис заблоковано',
  [StringNames.Error_AccountStatusIsPendingEmailVerification]:
    'Обліковий запис очікує підтвердження електронної пошти',
  [StringNames.Error_AllCardsPlaced]: 'Всі картки розміщені',
  [StringNames.Error_ChefAlreadyInGame]: 'Шеф-кухар вже в грі',
  [StringNames.Error_EmailAlreadyVerified]: 'Електронна пошта вже підтверджена',
  [StringNames.Error_EmailInUse]: 'Електронна пошта вже використовується',
  [StringNames.Error_EmailTokenAlreadyUsed]:
    'Посилання для підтвердження електронної пошти вже використано або недійсне',
  [StringNames.Error_EmailTokenExpired]:
    'Термін дії посилання закінчився. Будь ласка, запросіть новий.',
  [StringNames.Error_EmailTokenSentTooRecentlyTemplate]:
    'Маркер електронної пошти надіслано занадто недавно. Повторіть спробу через {TIME_REMAINING} с.',
  [StringNames.Error_FailedToCreateEmailToken]:
    'Неможливо створити електронний токен',
  [StringNames.Error_SendTokenFailure]:
    'Неможливо відправити електронний токен',
  [StringNames.Error_TooManyChefs]: 'Забагато шеф-кухарів на кухні',
  [StringNames.Error_YouAlreadyJoined]: 'Ви вже приєдналися до цієї гри',
  [StringNames.Dashboard_GamesCreated]: 'Гри, які ти створив',
  [StringNames.Dashboard_GamesParticipating]: 'Гри, в яких ти береш участь',
  [StringNames.Dashboard_NoGames]: 'Немає доступних ігор.',
  [StringNames.Dashboard_Title]: 'Ваша Панель',
  [StringNames.ForgotPassword_ForgotPassword]: 'Забули пароль?',
  [StringNames.ForgotPassword_InvalidToken]:
    'Недіїдженний токен. Будь ласка, зверніться до підтримки.',
  [StringNames.ForgotPassword_ResetPassword]: 'Скинути пароль',
  [StringNames.ForgotPassword_SendResetToken]:
    'Відправити лист зі скиданням пароля',
  [StringNames.ForgotPassword_Success]:
    'Ваш пароль успішно змінено. Тепер ви можете використовувати новий пароль для входу.',
  [StringNames.ForgotPassword_Title]: 'Забули пароль',
  [StringNames.Game_CreateGame]: 'Створити гру',
  [StringNames.Game_CreateGameSuccess]: 'Гру успішно створено',
  [StringNames.Game_JoinGame]: 'Приєднатися до гри',
  [StringNames.Game_JoinGameSuccess]: 'Успішно приєднано до гри',
  [StringNames.Game_ListSuccess]: 'Список ігор успішно отримано',
  [StringNames.KeyFeatures_Title]: 'Ключові Жарактеристики',
  [StringNames.KeyFeatures_1]:
    'Захоплюючий геймплей блефу з кулінарним родзинкою',
  [StringNames.KeyFeatures_2]: 'Стратегічні ставки та розміщення карток',
  [StringNames.KeyFeatures_3]: 'Швидко навчатися, складно освоїти',
  [StringNames.KeyFeatures_4]: 'Підтримує 2 або більше гравців',
  [StringNames.KeyFeatures_5]: 'Раунди напруженого гортання карт',
  [StringNames.KeyFeatures_6]: 'Управління ризиками: уникайте страшного чилі!',
  [StringNames.KeyFeatures_7]:
    'Перемагає перший, хто приправив дві страви, або останній шеф-кухар',
  [StringNames.KeyFeatures_8]:
    'Ідеально підходить для вечірніх ігор і сімейних зустрічей',
  [StringNames.LanguageUpdate_Success]: 'Мова оновлена успішно',
  [StringNames.Login_LoginButton]: 'Увійти',
  [StringNames.Login_Progress]: 'Вхід...',
  [StringNames.Login_ResentPasswordFailure]:
    'Невдалося відправити новий пароль',
  [StringNames.Login_ResentPasswordSuccess]:
    'Новиий пароль успішно відправлено',
  [StringNames.Login_Title]: 'Увійти',
  [StringNames.Login_UsernameOrEmailRequired]:
    'Необхідно вказати ім’я користувача або електронну пошту',
  [StringNames.LogoutButton]: 'Вийти',
  [StringNames.RegisterButton]: 'Зареєструватися',
  [StringNames.ResetPassword_ChangeEmailFirst]:
    'Будь ласка, підтвердіть вашу електронну адресу перед скиданням пароля.',
  [StringNames.ResetPassword_Sent]:
    'Якщо обліковий запис із такою електронною адресою існує, було надіслано посилання для зміни пароля.',
  [StringNames.ResetPassword_Success]: 'Пароль успішно скинуто',
  [StringNames.Splash_Description]:
    'У Chili and Cilantro починаючі кухарі змагаються, щоб створити ідеальну страву. Ваша мета — додати потрібну кількість кінзи, не зіпсувавши її пекучим чилі. Будьте першим, хто успішно приправить дві страви, або будьте останнім шеф-кухарем, який виграє!',
  [StringNames.Splash_HowToPlay]: 'Як Грати',
  [StringNames.ValidationError]: 'Помилка валідації',
  [StringNames.Validation_InvalidEmail]: 'Недійсний електронній адрес',
  [StringNames.Validation_InvalidLanguage]: 'Недійсна мова',
  [StringNames.Validation_InvalidTimezone]: 'Недійсна часова зона',
  [StringNames.Validation_InvalidToken]: 'Недійсний токен',
  [StringNames.Validation_PasswordRegexErrorTemplate]: `Пароль повинен бути від {MIN_PASSWORD_LENGTH} до {MAX_PASSWORD_LENGTH} символів, та містити як мінімум:
  • Одну нижню літеру (всіх скриптів)
  • Одну верхню літеру (всіх скриптів)
  • Одну цифру (будь-яку систему числення)
  • Один спеціальний символ (пунктуацію або символ)`,
  [StringNames.Validation_CurrentPasswordRequired]:
    'Поточний пароль є обов’язковим',
  [StringNames.Validation_PasswordsDifferent]:
    'Новий пароль повинен відрізнятися від поточного',
  [StringNames.Validation_NewPasswordRequired]: 'Новий пароль є обов’язковим',
  [StringNames.Validation_PasswordMatch]:
    'Пароль та підтвердження повинні співпадати',
  [StringNames.Validation_ConfirmNewPassword]:
    'Підтвердження нового пароля є обов’язковим',
  [StringNames.Validation_Required]: 'Обов’язково',
  [StringNames.Validation_UsernameRegexErrorTemplate]: `Ім’я користувача повинно бути від {MIN_USERNAME_LENGTH} до {MAX_USERNAME_LENGTH} символів, та:
  • Починатися з літери, числа, або Unicode-символу
  • Містити літери, числа, підкреслення, тире, та Unicode-символи
  • Не містити пробілів або спеціальних символів, крім підкреслення і тире`,
  [StringNames.TEST_TESTTEMPLATE]: 'Тестування {VARIABLE1} {VARIABLE2}',
};

export default UkrainianStrings;
