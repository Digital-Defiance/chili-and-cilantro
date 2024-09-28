import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = 'Чілі та Коріандр';

export const UkrainianStrings: StringsCollection = {
  [StringNames.ChangePassword_ChangePasswordButton]: 'Змінити пароль',
  [StringNames.Common_ChangePassword]: 'Змінити пароль',
  [StringNames.Common_ConfirmNewPassword]: 'Підтвердити новий пароль',
  [StringNames.Common_CurrentPassword]: 'Поточний пароль',
  [StringNames.Common_NewPassword]: 'Новий пароль',
  [StringNames.Common_Dashboard]: 'Панель',
  [StringNames.Common_Loading]: 'Завантаження...',
  [StringNames.Common_Logo]: 'лого',
  [StringNames.Common_ReturnToKitchen]: 'Повернутися на Кухню',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Почати приготування',
  [StringNames.Common_Tagline]: 'Пікантний Блеф',
  [StringNames.Common_Unauthorized]: 'Немає авторизації',
  [StringNames.Common_UnexpectedError]: 'Неочікувана помилка',
  [StringNames.Dashboard_GamesCreated]: 'Гри, які ти створив',
  [StringNames.Dashboard_GamesParticipating]: 'Гри, в яких ти береш участь',
  [StringNames.Dashboard_NoGames]: 'Немає доступних ігор.',
  [StringNames.Dashboard_Title]: 'Ваша Панель',
  [StringNames.ForgotPassword_Title]: 'Забули пароль',
  [StringNames.Game_CreateGame]: 'Створити гру',
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
  [StringNames.LogoutButton]: 'Вийти',
  [StringNames.RegisterButton]: 'Зареєструватися',
  [StringNames.Splash_Description]:
    'У Chili and Cilantro починаючі кухарі змагаються, щоб створити ідеальну страву. Ваша мета — додати потрібну кількість кінзи, не зіпсувавши її пекучим чилі. Будьте першим, хто успішно приправить дві страви, або будьте останнім шеф-кухарем, який виграє!',
  [StringNames.Splash_HowToPlay]: 'Як Грати',
  [StringNames.ValidationError]: 'Помилка валідації',
  [StringNames.Validation_InvalidEmail]: 'Недійсний електронній адрес',
  [StringNames.Validation_InvalidLanguage]: 'Недійсна мова',
  [StringNames.Validation_InvalidToken]: 'Недійсний токен',
  [StringNames.Validation_PasswordRegexError]:
    'Пароль повинен містити принаймні 8 символів, включаючи принаймні одну літеру, одну цифру та один спеціальний символ (!@#$%^&*()_+-=[]{};\':"|,.<>/?)',
  [StringNames.Validation_CurrentPasswordRequired]:
    'Поточний пароль є обов’язковим',
  [StringNames.Validation_PasswordsDifferent]:
    'Новий пароль повинен відрізнятися від поточного',
  [StringNames.Validation_NewPasswordRequired]: 'Новий пароль є обов’язковим',
  [StringNames.Validation_PasswordMatch]:
    'Пароль та підтвердження повинні співпадати',
  [StringNames.Validation_ConfirmNewPassword]:
    'Підтвердження нового пароля є обов’язковим',
};

export default UkrainianStrings;
