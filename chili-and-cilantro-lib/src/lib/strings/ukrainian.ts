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
  [StringNames.Common_CheckingAuthentication]: 'Перевіряємо автентифікацію...',
  [StringNames.Common_Chef]: 'Шеф-кухар',
  [StringNames.Common_ConfirmNewPassword]: 'Підтвердити новий пароль',
  [StringNames.Common_CurrentPassword]: 'Поточний пароль',
  [StringNames.Common_Email]: 'Електронна пошта',
  [StringNames.Common_GoToSplash]: 'Повернутися до привітання',
  [StringNames.Common_NewPassword]: 'Новий пароль',
  [StringNames.Common_Dashboard]: 'Панель',
  [StringNames.Common_DisplayName]: 'Ім’я відображення',
  [StringNames.Common_Game]: 'Гра',
  [StringNames.Common_GameCode]: 'Код гри',
  [StringNames.Common_GameName]: 'Назва гри',
  [StringNames.Common_GamePassword]: 'Пароль гри',
  [StringNames.Common_Kitchen]: 'Кухня',
  [StringNames.Common_Loading]: 'Завантаження...',
  [StringNames.Common_Logo]: 'Логотип',
  [StringNames.Common_MasterChef]: 'Головний Кухар',
  [StringNames.Common_MaxChefs]: 'Максимальна кількість кухарів',
  [StringNames.Common_Optional]: 'Необов’язково',
  [StringNames.Common_Password]: 'Пароль',
  [StringNames.Common_ReturnToKitchen]: 'Повернутися до кухні',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Почати приготування',
  [StringNames.Common_Success]: 'Успіх',
  [StringNames.Common_Tagline]: 'Гострий блеф',
  [StringNames.Common_TokenRefreshed]: 'Токен оновлено',
  [StringNames.Common_TokenValid]: 'Токен дійсний',
  [StringNames.Common_Unauthorized]: 'Неавторизовано',
  [StringNames.Common_UnexpectedError]: 'Неочікувана помилка',
  [StringNames.Common_Username]: 'Ім’я користувача',
  [StringNames.EmailToken_ExpiresInTemplate]:
    'Посилання дійсне {EMAIL_TOKEN_EXPIRATION_MIN} хвилин',
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
  [StringNames.Error_GameAlreadyInProgress]: 'Гра вже розпочалася',
  [StringNames.Error_GameDisplayNameAlreadyInUse]:
    'Ім’я вже використовується в цій грі.',
  [StringNames.Error_GameEnded]: 'Гра завершилася',
  [StringNames.Error_GameInvalidPhase]:
    'Гра не знаходиться в правильній фазі для цієї дії.',
  [StringNames.Error_GamePasswordMismatch]: 'Пароль гри не відповідає',
  [StringNames.Error_InvalidAction]: 'Недійсна дія',
  [StringNames.Error_InvalidCredentials]: 'Неправильні дані',
  [StringNames.Error_InvalidEndGameReason]: 'Недійсна причина завершення гри',
  [StringNames.Error_MustBeMasterChef]:
    'Ви повинні бути майстром-кухарем, щоб виконати цю дію.',
  [StringNames.Error_NotEnoughChefsTemplate]:
    'Недостатньо шеф-кухарів для початку гри. {CHEFS_PRESENT}/{MIN_CHEFS}',
  [StringNames.Error_NotFound]: 'Не знайдено',
  [StringNames.Error_NotInGame]: 'Ви не в цій грі',
  [StringNames.Error_NotLoggedIn]: 'Ви не увійшли в систему',
  [StringNames.Error_NotYourTurn]: 'Це не ваш ход',
  [StringNames.Error_OutOfIngredientTemplate]: 'Недостатньо {INGREDIENT}.',
  [StringNames.Error_SendTokenFailure]:
    'Неможливо відправити електронний токен',
  [StringNames.Error_TooManyChefs]: 'Забагато шеф-кухарів на кухні',
  [StringNames.Error_UnexpectedTurnActionTemplate]:
    'Неочікувана дія в ході: {TURN_ACTION}',
  [StringNames.Error_UsernameInUse]: 'Ім’я користувача вже використовується',
  [StringNames.Error_UserNotFound]: 'Користувача не знайдено',
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
  [StringNames.Game_EndGame]: 'Завершити гру',
  [StringNames.Game_JoinGame]: 'Приєднатися до гри',
  [StringNames.Game_JoinGameSuccess]: 'Успішно приєднано до гри',
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
  [StringNames.LetsCook_AddChef]: 'Додати Шеф-кухара',
  [StringNames.LetsCook_RemoveChef]: 'Видалити Шеф-кухара',
  [StringNames.LetsCook_Title]: 'Давайте Готувати',
  [StringNames.LanguageUpdate_Success]: 'Мова оновлена успішно',
  [StringNames.Login_LoginButton]: 'Увійти',
  [StringNames.Login_NoAccountSignUp]: 'Ви не маєте аккаунту? Зареєструватися',
  [StringNames.Login_Progress]: 'Вхід...',
  [StringNames.Login_ResendPasswordLink]: 'Надіслати лист з новим паролем',
  [StringNames.Login_ResentPasswordFailure]:
    'Невдалося відправити новий пароль',
  [StringNames.Login_ResentPasswordSuccess]:
    'Новиий пароль успішно відправлено',
  [StringNames.Login_Title]: 'Увійти',
  [StringNames.Login_UseEmail]: 'Використовувати електронну пошту',
  [StringNames.Login_UseUsername]: 'Використовувати ім’я користувача',
  [StringNames.Login_UsernameOrEmailRequired]:
    'Необхідно вказати ім’я користувача або електронну пошту',
  [StringNames.LogoutButton]: 'Вийти',
  [StringNames.RegisterButton]: 'Зареєструватися',
  [StringNames.Register_LoginLink]: 'Вже є аккаунт? Увійти',
  [StringNames.Register_Progress]: 'Реєстрація...',
  [StringNames.Register_Success]:
    'Реєстрація успішна! Перенаправлення на сторінку входу...',
  [StringNames.Register_Title]: 'Зареєструватися',
  [StringNames.ResetPassword_ChangeEmailFirst]:
    'Будь ласка, підтвердіть вашу електронну адресу перед скиданням пароля.',
  [StringNames.ResetPassword_Sent]:
    'Якщо обліковий запис із такою електронною адресою існує, було надіслано посилання для зміни пароля.',
  [StringNames.ResetPassword_Success]: 'Пароль успішно скинуто',
  [StringNames.Splash_Description]:
    'У Chili and Cilantro починаючі кухарі змагаються, щоб створити ідеальну страву. Ваша мета — додати потрібну кількість кінзи, не зіпсувавши її пекучим чилі. Будьте першим, хто успішно приправить дві страви, або будьте останнім шеф-кухарем, який виграє!',
  [StringNames.Splash_HowToPlay]: 'Як Грати',
  [StringNames.ValidationError]: 'Помилка валідації',
  [StringNames.Validation_DisplayNameRegexErrorTemplate]:
    'Ім’я користувача повинно бути від {MIN_USER_DISPLAY_NAME_LENGTH} до {MAX_USER_DISPLAY_NAME_LENGTH} символів',
  [StringNames.Validation_DisplayNameRequired]:
    'Ім’я користувача є обов’язковим',
  [StringNames.Validation_GameCodeRequired]: 'Код гри є обов’язковим',
  [StringNames.Validation_GameNameRegexErrorTemplate]:
    'Ім’я гри повинно бути від {MIN_GAME_NAME_LENGTH} до {MAX_GAME_NAME_LENGTH} символів.',
  [StringNames.Validation_GameNameRequired]: 'Ім’я гри є обов’язковим',
  [StringNames.Validation_GamePasswordRegexErrorTemplate]:
    'Пароль гри повинен бути від {MIN_GAME_PASSWORD_LENGTH} до {MAX_GAME_PASSWORD_LENGTH} символів',
  [StringNames.Validation_InvalidEmail]: 'Недійсний електронній адрес',
  [StringNames.Validation_InvalidGame]:
    'Недійсний ідентифікатор гри або гра не існує.',
  [StringNames.Validation_InvalidGameCode]: 'Недійсний код гри',
  [StringNames.Validation_InvalidGameCodeTemplate]:
    'Код гри повинен бути {GAME_CODE_LENGTH} символів',
  [StringNames.Validation_InvalidGameName]: 'Недійсне ім’я гри',
  [StringNames.Validation_InvalidGameNameTemplate]:
    'Ім’я гри повинно бути від {MIN_GAME_NAME_LENGTH} до {MAX_GAME_NAME_LENGTH} символів.',
  [StringNames.Validation_InvalidLanguage]: 'Недійсна мова',
  [StringNames.Validation_InvalidMaxChefsTemplate]:
    'Максимальна кількість шеф-кухарів повинна бути від {MIN_CHEFS} до {MAX_CHEFS}.',
  [StringNames.Validation_InvalidMaxChefsValueTemplate]:
    '{VALUE} не є допустимою кількістю шеф-кухарів! Максимальна кількість шеф-кухарів повинна бути від {MIN_CHEFS} до {MAX_CHEFS}.',
  [StringNames.Validation_InvalidMessage]: 'Недійсне повідомлення',
  [StringNames.Validation_InvalidTimezone]: 'Недійсна часова зона',
  [StringNames.Validation_InvalidToken]: 'Недійсний токен',
  [StringNames.Validation_MaxChefsRequired]:
    'Максимальна кількість шеф-кухарів є обов’язковою',
  [StringNames.Validation_MessageRegexErrorTemplate]:
    'Повідомлення повинно бути від {MIN_MESSAGE_LENGTH} до {MAX_MESSAGE_LENGTH} символів.',
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
  [StringNames.VerifyEmail_Success]: 'Електронна пошта підтверджена',
  [StringNames.TEST_TESTTEMPLATE]: 'Тестування {VARIABLE1} {VARIABLE2}',
};

export default UkrainianStrings;
