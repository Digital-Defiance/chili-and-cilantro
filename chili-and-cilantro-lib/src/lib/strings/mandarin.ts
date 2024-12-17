import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = '辣椒和香菜';

export const MandarinStrings: StringsCollection = {
  [StringNames.ChangePassword_ChangePasswordButton]: '更改密码',
  [StringNames.Common_ChangePassword]: '更改密码',
  [StringNames.Common_ConfirmNewPassword]: '确认新密码',
  [StringNames.Common_CurrentPassword]: '当前密码',
  [StringNames.Common_NewPassword]: '新密码',
  [StringNames.Common_Dashboard]: '仪表板',
  [StringNames.Common_Loading]: '加载中...',
  [StringNames.Common_Logo]: '标志',
  [StringNames.Common_ReturnToKitchen]: '返回厨房',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: '开始烹饪',
  [StringNames.Common_Tagline]: '一款辛辣的虚张声势游戏',
  [StringNames.Common_Unauthorized]: '未经授权',
  [StringNames.Common_UnexpectedError]: '意外错误',
  [StringNames.Dashboard_GamesCreated]: '您创建的游戏',
  [StringNames.Dashboard_GamesParticipating]: '您参与的游戏',
  [StringNames.Dashboard_NoGames]: '没有可用的游戏。',
  [StringNames.Dashboard_Title]: '您的仪表板',
  [StringNames.ForgotPassword_Title]: '忘记密码',
  [StringNames.Game_CreateGame]: '创建游戏',
  [StringNames.Game_ListSuccess]: '成功检索游戏列表',
  [StringNames.KeyFeatures_Title]: '主要特点',
  [StringNames.KeyFeatures_1]: '令人兴奋的虚张声势游戏，带有烹饪的扭曲',
  [StringNames.KeyFeatures_2]: '战略性出价和卡片放置',
  [StringNames.KeyFeatures_3]: '易学，难以掌握',
  [StringNames.KeyFeatures_4]: '支持2个或更多玩家',
  [StringNames.KeyFeatures_5]: '一轮轮充满悬念的纸牌游戏',
  [StringNames.KeyFeatures_6]: '风险管理：避免可怕的辣椒！',
  [StringNames.KeyFeatures_7]: '首先调味两道菜或最后一位厨师站起来赢得胜利',
  [StringNames.KeyFeatures_8]: '适合游戏之夜和家庭聚会',
  [StringNames.LanguageUpdate_Success]: '语言更新成功',
  [StringNames.Login_LoginButton]: '登录',
  [StringNames.LogoutButton]: '注销',
  [StringNames.RegisterButton]: '注册',
  [StringNames.Splash_Description]:
    '在《辣椒和香菜》中，有抱负的厨师们竞相制作完美的菜肴。你的目标是添加适量的香菜，而不会让辣椒烧焦。成为第一个成功调味两道菜的人，或者成为最后一个获胜的厨师',
  [StringNames.Splash_HowToPlay]: '如何玩',
  [StringNames.ValidationError]: '验证错误',
  [StringNames.Validation_InvalidEmail]: '无效电子邮件',
  [StringNames.Validation_InvalidLanguage]: '无效语言',
  [StringNames.Validation_InvalidToken]: '无效令牌',
  [StringNames.Validation_PasswordRegexError]:
    '密码必须至少8个字符长且包含至少一个字母、一个数字和一个特殊字符(!@#$%^&*()_+-=[]{};:"|,.<>/?)',
  [StringNames.Validation_CurrentPasswordRequired]: '当前密码是必需的',
  [StringNames.Validation_PasswordsDifferent]: '新密码必须不同于当前密码',
  [StringNames.Validation_NewPasswordRequired]: '新密码是必需的',
  [StringNames.Validation_PasswordMatch]: '密码和确认必须匹配',
  [StringNames.Validation_ConfirmNewPassword]: '确认新密码是必需的',
};

export default MandarinStrings;
