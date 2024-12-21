import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = '辣椒和香菜';

export const MandarinStrings: StringsCollection = {
  [StringNames.AccountError_Message]: '您的帐户似乎有问题。请联系支持。',
  [StringNames.AccountError_Title]: '帐户错误',
  [StringNames.ChangePassword_ChangePasswordButton]: '更改密码',
  [StringNames.ChangePassword_Success]: '密码更改成功',
  [StringNames.Common_ChangePassword]: '更改密码',
  [StringNames.Common_ConfirmNewPassword]: '确认新密码',
  [StringNames.Common_CurrentPassword]: '当前密码',
  [StringNames.Common_Email]: '电子邮件',
  [StringNames.Common_GoToSplash]: '返回欢迎屏幕',
  [StringNames.Common_NewPassword]: '新密码',
  [StringNames.Common_Dashboard]: '仪表板',
  [StringNames.Common_Loading]: '加载中...',
  [StringNames.Common_Logo]: '标志',
  [StringNames.Common_MasterChef]: '大厨',
  [StringNames.Common_Password]: '密码',
  [StringNames.Common_ReturnToKitchen]: '返回厨房',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: '开始烹饪',
  [StringNames.Common_Tagline]: '一款辛辣的虚张声势游戏',
  [StringNames.Common_TokenValid]: '令牌有效',
  [StringNames.Common_Unauthorized]: '未经授权',
  [StringNames.Common_UnexpectedError]: '意外错误',
  [StringNames.Common_Username]: '用户名',
  [StringNames.EmailToken_ExpiresInTemplate]:
    '链接在{EMAIL_TOKEN_EXPIRATION_MIN}分钟后过期。',
  [StringNames.EmailToken_TitleEmailConfirm]: '电子邮件确认',
  [StringNames.EmailToken_TitleResetPassword]: '密码重置',
  [StringNames.EmailToken_ClickLinkEmailConfirm]:
    '请单击下面的链接确认您的电子邮件。',
  [StringNames.EmailToken_ClickLinkResetPassword]: '请单击下面的链接重置密码。',
  [StringNames.Error_AccountStatusIsDeleted]: '帐户已删除',
  [StringNames.Error_AccountStatusIsLocked]: '帐户已锁定',
  [StringNames.Error_AccountStatusIsPendingEmailVerification]:
    '帐户待电子邮件验证',
  [StringNames.Error_AllCardsPlaced]: '所有卡片已放置',
  [StringNames.Error_ChefAlreadyInGame]: '厨师已经在游戏中',
  [StringNames.Error_EmailAlreadyVerified]: '电子邮件已验证',
  [StringNames.Error_EmailInUse]: '电子邮件已在使用中',
  [StringNames.Error_EmailTokenAlreadyUsed]: '电子邮件验证链接已被使用或无效',
  [StringNames.Error_EmailTokenExpired]: '验证链接已过期。请请求一个新的。',
  [StringNames.Error_EmailTokenSentTooRecentlyTemplate]:
    '电子邮件令牌发送太频繁。请在{TIME_REMAINING}秒后重试。',
  [StringNames.Error_FailedToCreateEmailToken]: '无法创建电子邮件令牌',
  [StringNames.Error_GameAlreadyInProgress]: '游戏已经开始。',
  [StringNames.Error_GameDisplayNameAlreadyInUse]: '游戏名称已经在使用中',
  [StringNames.Error_GameInvalidPhase]: '游戏不处于此操作的正确阶段。',
  [StringNames.Error_GamePasswordMismatch]: '游戏密码不匹配',
  [StringNames.Error_InvalidAction]: '无效操作',
  [StringNames.Error_InvalidCredentials]: '无效凭证',
  [StringNames.Error_MustBeMasterChef]: '您必须是大厨才能执行此操作。',
  [StringNames.Error_NotEnoughChefsTemplate]:
    '没有足够的厨师开始游戏。{CHEFS_PRESENT}/{MIN_CHEFS}',
  [StringNames.Error_NotInGame]: '您不在这个游戏中',
  [StringNames.Error_NotYourTurn]: '不是你的回合',
  [StringNames.Error_OutOfIngredientTemplate]: '缺少{INGREDIENT}',
  [StringNames.Error_SendTokenFailure]: '无法发送电子邮件令牌',
  [StringNames.Error_TooManyChefs]: '厨房里有太多厨师',
  [StringNames.Error_UnexpectedTurnActionTemplate]:
    '意外的回合动作:{TURN_ACTION}',
  [StringNames.Error_UsernameInUse]: '用户名已经在使用中',
  [StringNames.Error_UserNotFound]: '用户未找到',
  [StringNames.Error_YouAlreadyJoined]: '您已经加入该游戏',
  [StringNames.Dashboard_GamesCreated]: '您创建的游戏',
  [StringNames.Dashboard_GamesParticipating]: '您参与的游戏',
  [StringNames.Dashboard_NoGames]: '没有可用的游戏。',
  [StringNames.Dashboard_Title]: '您的仪表板',
  [StringNames.ForgotPassword_ForgotPassword]: '忘记密码',
  [StringNames.ForgotPassword_InvalidToken]:
    '无效或过期的令牌。请请求新密码重置。',
  [StringNames.ForgotPassword_ResetPassword]: '重置密码',
  [StringNames.ForgotPassword_SendResetToken]: '发送重置电子邮件',
  [StringNames.ForgotPassword_Success]:
    '您的密码已成功重置。您现在可以使用新密码登录。',
  [StringNames.ForgotPassword_Title]: '忘记密码',
  [StringNames.Game_CreateGame]: '创建游戏',
  [StringNames.Game_CreateGameSuccess]: '成功创建游戏',
  [StringNames.Game_JoinGame]: '加入游戏',
  [StringNames.Game_JoinGameSuccess]: '成功加入游戏',
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
  [StringNames.Login_Progress]: '登录中...',
  [StringNames.Login_ResentPasswordFailure]: '重新发送密码失败',
  [StringNames.Login_ResentPasswordSuccess]: '重发密码成功',
  [StringNames.Login_Title]: '登录',
  [StringNames.Login_UsernameOrEmailRequired]: '需要用户名或电子邮件',
  [StringNames.LogoutButton]: '注销',
  [StringNames.RegisterButton]: '注册',
  [StringNames.ResetPassword_ChangeEmailFirst]:
    '在重置密码之前，请验证您的电子邮件地址。',
  [StringNames.ResetPassword_Sent]:
    '如果有帐户与此电子邮件相关,密码重置链接已发送。',
  [StringNames.ResetPassword_Success]: '密码重置成功',
  [StringNames.Splash_Description]:
    '在《辣椒和香菜》中，有抱负的厨师们竞相制作完美的菜肴。你的目标是添加适量的香菜，而不会让辣椒烧焦。成为第一个成功调味两道菜的人，或者成为最后一个获胜的厨师',
  [StringNames.Splash_HowToPlay]: '如何玩',
  [StringNames.ValidationError]: '验证错误',
  [StringNames.Validation_DisplayNameRegexErrorTemplate]:
    '用户显示名称必须在{MIN_USER_DISPLAY_NAME_LENGTH}和{MAX_USER_DISPLAY_NAME_LENGTH}个字符之间',
  [StringNames.Validation_DisplayNameRequired]: '昵称是必需的',
  [StringNames.Validation_GameCodeRequired]: '游戏代码是必需的',
  [StringNames.Validation_GameNameRequired]: '游戏名是必需的',
  [StringNames.Validation_GamePasswordRegexErrorTemplate]:
    '游戏密码必须在{MIN_GAME_PASSWORD_LENGTH}和{MAX_GAME_PASSWORD_LENGTH}个字符之间',
  [StringNames.Validation_InvalidEmail]: '无效电子邮件',
  [StringNames.Validation_InvalidGame]: '无效游戏ID或游戏不存在。',
  [StringNames.Validation_InvalidGameCode]: '无效游戏代码',
  [StringNames.Validation_InvalidGameCodeTemplate]:
    '游戏代码必须是{GAME_CODE_LENGTH}个字符长',
  [StringNames.Validation_InvalidGameName]: '无效游戏名称',
  [StringNames.Validation_InvalidGameNameTemplate]:
    '游戏名称必须在{MIN_GAME_NAME_LENGTH}和{MAX_GAME_NAME_LENGTH}个字符之间。',
  [StringNames.Validation_InvalidLanguage]: '无效语言',
  [StringNames.Validation_InvalidMessage]: '无效消息',
  [StringNames.Validation_InvalidMaxChefs]: '无效厨师数量',
  [StringNames.Validation_InvalidTimezone]: '无效时区',
  [StringNames.Validation_InvalidToken]: '无效令牌',
  [StringNames.Validation_MaxChefsRequired]: '最大厨师是必需的',
  [StringNames.Validation_MessageRegexErrorTemplate]:
    '消息必须在{MIN_MESSAGE_LENGTH}和{MAX_MESSAGE_LENGTH}个字符之间。',
  [StringNames.Validation_PasswordRegexErrorTemplate]: `密码必须在{MIN_PASSWORD_LENGTH}和{MAX_PASSWORD_LENGTH}个字符之间，并且至少包含：
  • 一个小写字母（任何脚本）
  • 一个大写字母（任何脚本）
  • 一个数字（任何数字系统）
  • 一个特殊字符（标点符号或符号）`,
  [StringNames.Validation_CurrentPasswordRequired]: '当前密码是必需的',
  [StringNames.Validation_PasswordsDifferent]: '新密码必须不同于当前密码',
  [StringNames.Validation_NewPasswordRequired]: '新密码是必需的',
  [StringNames.Validation_PasswordMatch]: '密码和确认必须匹配',
  [StringNames.Validation_ConfirmNewPassword]: '确认新密码是必需的',
  [StringNames.Validation_Required]: '必填',
  [StringNames.Validation_UsernameRegexErrorTemplate]: `用户名必须在{MIN_USERNAME_LENGTH}和{MAX_USERNAME_LENGTH}个字符之间，并且：
  • 以字母，数字，或Unicode字符开头
  • 可以包含字母，数字，下划线，短横线，或Unicode字符
  • 不能包含空格或特殊字符，除下划线和短横线外`,
  [StringNames.TEST_TESTTEMPLATE]: '测试 {VARIABLE1} {VARIABLE2}',
};

export default MandarinStrings;
