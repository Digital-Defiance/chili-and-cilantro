import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = 'Chili and Cilantro';

export const BritishEnglishStrings: StringsCollection = {
  [StringNames.AccountError_Message]:
    'There seems to be an issue with your account. Please contact support.',
  [StringNames.AccountError_Title]: 'Account Error',
  [StringNames.ChangePassword_ChangePasswordButton]: 'Change Password',
  [StringNames.Common_ChangePassword]: 'Change Password',
  [StringNames.Common_ConfirmNewPassword]: 'Confirm New Password',
  [StringNames.Common_CurrentPassword]: 'Current Password',
  [StringNames.Common_GoToSplash]: 'Return to Welcome Screen',
  [StringNames.Common_NewPassword]: 'New Password',
  [StringNames.Common_Dashboard]: 'Dashboard',
  [StringNames.Common_Loading]: 'Loading...',
  [StringNames.Common_Logo]: 'logo',
  [StringNames.Common_ReturnToKitchen]: 'Return to Kitchen',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Start Cooking',
  [StringNames.Common_Tagline]: 'A Spicy Bluffing Game',
  [StringNames.Common_Unauthorized]: 'Unauthorized',
  [StringNames.Common_UnexpectedError]: 'Unexpected Error',
  [StringNames.Dashboard_GamesCreated]: "Games You've Created",
  [StringNames.Dashboard_GamesParticipating]: "Games You're Participating in",
  [StringNames.Dashboard_NoGames]: 'No games available.',
  [StringNames.Dashboard_Title]: 'Your Dashboard',
  [StringNames.ForgotPassword_Title]: 'Forgot Password',
  [StringNames.Game_CreateGame]: 'Create Game',
  [StringNames.Game_CreateGameSuccess]: 'Game created successfully',
  [StringNames.Game_JoinGame]: 'Join Game',
  [StringNames.Game_JoinGameSuccess]: 'Joined game successfully',
  [StringNames.Game_ListSuccess]: 'Retrieved game list successfully',
  [StringNames.KeyFeatures_Title]: 'Key Features',
  [StringNames.KeyFeatures_1]:
    'Exciting bluffing gameplay with a culinary twist',
  [StringNames.KeyFeatures_2]: 'Strategic bidding and card placement',
  [StringNames.KeyFeatures_3]: 'Quick to learn, challenging to master',
  [StringNames.KeyFeatures_4]: 'Supports 2 or more players',
  [StringNames.KeyFeatures_5]: 'Rounds of suspenseful card flipping',
  [StringNames.KeyFeatures_6]: 'Risk management: avoid the dreaded chili!',
  [StringNames.KeyFeatures_7]:
    'First to season two dishes or last chef standing wins',
  [StringNames.KeyFeatures_8]: 'Perfect for game nights and family gatherings',
  [StringNames.LanguageUpdate_Success]: 'Language updated successfully',
  [StringNames.Login_LoginButton]: 'Login',
  [StringNames.LogoutButton]: 'Logout',
  [StringNames.RegisterButton]: 'Register',
  [StringNames.Splash_Description]:
    'In Chili and Cilantro, aspiring chefs compete to create the perfect dish. Your goal is to add just the right amount of cilantro without ruining it with a scorching chili. Be the first to successfully season two dishes or be the last chef standing to win!',
  [StringNames.Splash_HowToPlay]: 'How to Play',
  [StringNames.ValidationError]: 'Validation Error',
  [StringNames.Validation_InvalidEmail]: 'Invalid Email',
  [StringNames.Validation_InvalidLanguage]: 'Invalid Language',
  [StringNames.Validation_InvalidToken]: 'Invalid Token',
  [StringNames.Validation_PasswordRegexError]:
    'Password must be at least 8 characters long and include at least one letter, one number, and one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)',
  [StringNames.Validation_CurrentPasswordRequired]:
    'Current password is required',
  [StringNames.Validation_PasswordsDifferent]:
    'New password must be different than the current password',
  [StringNames.Validation_NewPasswordRequired]: 'New password is required',
  [StringNames.Validation_PasswordMatch]: 'Password and confirm must match',
  [StringNames.Validation_ConfirmNewPassword]:
    'Confirm new password is required',
};

export default BritishEnglishStrings;
