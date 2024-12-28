import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = 'Chili y Cilantro';

export const SpanishStrings: StringsCollection = {
  [StringNames.AccountError_Message]:
    'Parece que hay un problema con tu cuenta. Por favor, contacta con soporte.',
  [StringNames.AccountError_Title]: 'Error de cuenta',
  [StringNames.ChangePassword_ChangePasswordButton]: 'Cambiar contraseña',
  [StringNames.ChangePassword_Success]: 'Contraseña cambiada con éxito',
  [StringNames.Common_ChangePassword]: 'Cambiar contraseña',
  [StringNames.Common_CheckingAuthentication]: 'Verificando autenticación...',
  [StringNames.Common_Chef]: 'Chef',
  [StringNames.Common_ConfirmNewPassword]: 'Confirmar nueva contraseña',
  [StringNames.Common_CurrentPassword]: 'Contraseña actual',
  [StringNames.Common_Email]: 'Correo electrónica',
  [StringNames.Common_GoToSplash]: 'Volver a la pantalla de bienvenida',
  [StringNames.Common_NewPassword]: 'Nueva contraseña',
  [StringNames.Common_Dashboard]: 'Tablero',
  [StringNames.Common_DisplayName]: 'Nombre de usuario',
  [StringNames.Common_Game]: 'Juego',
  [StringNames.Common_GameCode]: 'Código de juego',
  [StringNames.Common_GameName]: 'Nombre de juego',
  [StringNames.Common_GamePassword]: 'Contraseña de juego',
  [StringNames.Common_Kitchen]: 'Cocina',
  [StringNames.Common_Loading]: 'Cargando...',
  [StringNames.Common_Logo]: 'logo',
  [StringNames.Common_MasterChef]: 'Chef Maestro',
  [StringNames.Common_MaxChefs]: 'Cantidad máxima de chefs',
  [StringNames.Common_Optional]: 'Opcional',
  [StringNames.Common_Password]: 'Contraseña',
  [StringNames.Common_ReturnToKitchen]: 'Volver a la Cocina',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Comenzar a cocinar',
  [StringNames.Common_Success]: 'Éxito',
  [StringNames.Common_Tagline]: 'Un Juego de Bluff Picante',
  [StringNames.Common_TokenRefreshed]: 'Token refrescado',
  [StringNames.Common_TokenValid]: 'Token válido',
  [StringNames.Common_Unauthorized]: 'No autorizado',
  [StringNames.Common_UnexpectedError]: 'Error inesperado',
  [StringNames.Common_Username]: 'Nombre de usuario',
  [StringNames.EmailToken_ExpiresInTemplate]:
    'El enlace caducará en {EMAIL_TOKEN_EXPIRATION_MIN} minutos.',
  [StringNames.EmailToken_TitleEmailConfirm]:
    'Confirmación de correo electrónico',
  [StringNames.EmailToken_TitleResetPassword]: 'Restablecimiento de contraseña',
  [StringNames.EmailToken_ClickLinkEmailConfirm]:
    'Por favor, haz clic en el enlace de abajo para confirmar tu correo electrónica.',
  [StringNames.EmailToken_ClickLinkResetPassword]:
    'Por favor, haz clic en el enlace de abajo para restablecer tu contraseña.',
  [StringNames.Error_AccountStatusIsDeleted]: 'Cuenta eliminada',
  [StringNames.Error_AccountStatusIsLocked]: 'Cuenta bloqueada',
  [StringNames.Error_AccountStatusIsPendingEmailVerification]:
    'Cuenta en espera de verificación de correo electrónico',
  [StringNames.Error_AllCardsPlaced]: 'Todas las cartas han sido colocadas.',
  [StringNames.Error_ChefAlreadyInGame]: 'El chef ya está en un juego activo.',
  [StringNames.Error_EmailAlreadyVerified]:
    'El correo electrónico ya ha sido verificado',
  [StringNames.Error_EmailInUse]: 'El correo electrónica ya esta en uso.',
  [StringNames.Error_EmailTokenAlreadyUsed]:
    'El enlace de verificación de correo electrónica ya ha sido usado o es inválido.',
  [StringNames.Error_EmailTokenExpired]:
    'El enlace de verificación ha caducado. Por favor, solicita uno nuevo.',
  [StringNames.Error_EmailTokenSentTooRecentlyTemplate]:
    'El token de correo electrónico se envió hace muy poco. Inténtalo de nuevo en {TIME_REMAINING} segundos.',
  [StringNames.Error_FailedToCreateEmailToken]:
    'Fallo al crear el token de correo',
  [StringNames.Error_GameAlreadyInProgress]: 'El juego ya está en progreso.',
  [StringNames.Error_GameDisplayNameAlreadyInUse]:
    'El nombre ya está en uso en este juego.',
  [StringNames.Error_GameEnded]: 'El juego ha terminado.',
  [StringNames.Error_GameInvalidPhase]:
    'El juego no está en la fase correcta para esta acción.',
  [StringNames.Error_GamePasswordMismatch]:
    'La contraseña del juego no coincide.',
  [StringNames.Error_InvalidAction]: 'Acción inválida.',
  [StringNames.Error_InvalidCredentials]: 'Credenciales inválidas.',
  [StringNames.Error_InvalidEndGameReason]:
    'Razón de finalización de juego inválida',
  [StringNames.Error_MustBeMasterChef]:
    'Debes ser el chef maestro para realizar esta acción.',
  [StringNames.Error_NotEnoughChefsTemplate]:
    'No hay suficientes chefs para comenzar el juego. {CHEFS_PRESENT}/{MIN_CHEFS}',
  [StringNames.Error_NotFound]: 'No encontrado',
  [StringNames.Error_NotInGame]: 'No estás en este juego.',
  [StringNames.Error_NotLoggedIn]: 'No has iniciado sesión.',
  [StringNames.Error_NotYourTurn]: 'No es tu turno.',
  [StringNames.Error_OutOfIngredientTemplate]: 'Sin {INGREDIENT}.',
  [StringNames.Error_SendTokenFailure]: 'Fallo al enviar el token de correo',
  [StringNames.Error_TooManyChefs]: 'Demasiados chefs en la cocina',
  [StringNames.Error_UnexpectedTurnActionTemplate]:
    'Acción de turno inesperada: {TURN_ACTION}.',
  [StringNames.Error_UsernameInUse]: 'Nombre de usuario en uso',
  [StringNames.Error_UserNotFound]: 'Usuario no encontrado',
  [StringNames.Error_YouAlreadyJoined]: 'Ya te has unido a este juego',
  [StringNames.Dashboard_GamesCreated]: 'Juegos que has creado',
  [StringNames.Dashboard_GamesParticipating]: 'Juegos en los que participas',
  [StringNames.Dashboard_NoGames]: 'No hay juegos disponibles.',
  [StringNames.Dashboard_Title]: 'Tu Tablero',
  [StringNames.ForgotPassword_ForgotPassword]: 'Olvidé mi contraseña',
  [StringNames.ForgotPassword_InvalidToken]:
    'Token inválido o expirado. Por favor, solicita un nuevo restablecimiento de contraseña.',
  [StringNames.ForgotPassword_ResetPassword]: 'Restablecer contraseña',
  [StringNames.ForgotPassword_SendResetToken]:
    'Enviar restablecimiento de contraseña',
  [StringNames.ForgotPassword_Success]:
    'Tu contraseña ha sido restablecida con éxito. Ahora puedes usar tu nueva contraseña para ingresar.',
  [StringNames.ForgotPassword_Title]: 'Contraseña olvidada',
  [StringNames.Game_CreateGame]: 'Crear juego',
  [StringNames.Game_CreateGameSuccess]: 'Juego creado con éxito',
  [StringNames.Game_EndGame]: 'Terminar juego',
  [StringNames.Game_JoinGame]: 'Unirse al juego',
  [StringNames.Game_JoinGameSuccess]: 'Juego unido con éxito',
  [StringNames.KeyFeatures_Title]: 'Características Clave',
  [StringNames.KeyFeatures_1]:
    'Emocionante juego de faroleo con un toque culinario',
  [StringNames.KeyFeatures_2]: 'Pujas estratégicas y colocación de cartas',
  [StringNames.KeyFeatures_3]: 'Rápido de aprender, desafiante de dominar',
  [StringNames.KeyFeatures_4]: 'Admite 2 o más jugadores',
  [StringNames.KeyFeatures_5]: 'Rondas de volteo de cartas llenas de suspenso',
  [StringNames.KeyFeatures_6]: 'Gestión de riesgos: ¡evita el temido chile!',
  [StringNames.KeyFeatures_7]:
    'El primero en condimentar dos platos o el último chef en pie gana',
  [StringNames.KeyFeatures_8]:
    'Perfecto para noches de juegos y reuniones familiares',
  [StringNames.LetsCook_AddChef]: 'Añadir Chef',
  [StringNames.LetsCook_RemoveChef]: 'Eliminar Chef',
  [StringNames.LetsCook_Title]: 'Cocinemos',
  [StringNames.LanguageUpdate_Success]: 'Idioma actualizado con éxito',
  [StringNames.Login_LoginButton]: 'Iniciar sesión',
  [StringNames.Login_NoAccountSignUp]: 'No tienes una cuenta? Regístrate',
  [StringNames.Login_Progress]: 'Iniciando sesión...',
  [StringNames.Login_ResendPasswordLink]: 'Reenviar correo de verificación',
  [StringNames.Login_ResentPasswordFailure]: 'Reenviar contraseña fallido',
  [StringNames.Login_ResentPasswordSuccess]: 'Reenviar contraseña con éxito',
  [StringNames.Login_Title]: 'Iniciar sesión',
  [StringNames.Login_UseEmail]: 'Usar correo electrónico',
  [StringNames.Login_UseUsername]: 'Usar nombre de usuario',
  [StringNames.Login_UsernameOrEmailRequired]:
    'Se requiere un nombre de usuario o correo electrónica',
  [StringNames.LogoutButton]: 'Cerrar sesión',
  [StringNames.RegisterButton]: 'Registrarse',
  [StringNames.Register_LoginLink]: '¿Ya tienes una cuenta? Iniciar sesión',
  [StringNames.Register_Progress]: 'Registrando...',
  [StringNames.Register_Success]:
    'Registro exitoso! Redirigiendo a la página de inicio de sesión...',
  [StringNames.Register_Title]: 'Registrarse',
  [StringNames.ResetPassword_ChangeEmailFirst]:
    'Antes de restablecer la contraseña, verifica tu dirección de correo electrónico.',
  [StringNames.ResetPassword_Sent]:
    'Si existe una cuenta con ese correo electrónico, se ha enviado un enlace para restablecer la contraseña.',
  [StringNames.ResetPassword_Success]: 'Contraseña restablecida con éxito',
  [StringNames.Splash_Description]:
    'En Chili and Cilantro, los aspirantes a chef compiten para crear el plato perfecto. Tu objetivo es agregar la cantidad justa de cilantro sin arruinarlo con un chile abrasador. ¡Sé el primero en condimentar con éxito dos platos o sé el último chef en pie para ganar!',
  [StringNames.Splash_HowToPlay]: 'Como Jugar',
  [StringNames.ValidationError]: 'Error de validación',
  [StringNames.Validation_DisplayNameRegexErrorTemplate]:
    'El nombre de usuario debe tener entre {MIN_USER_DISPLAY_NAME_LENGTH} y {MAX_USER_DISPLAY_NAME_LENGTH} caracteres',
  [StringNames.Validation_DisplayNameRequired]:
    'Se requiere un nombre de usuario',
  [StringNames.Validation_GameCodeRequired]: 'Se requiere un código de juego',
  [StringNames.Validation_GameNameRegexErrorTemplate]:
    'El nombre del juego debe tener entre {MIN_GAME_NAME_LENGTH} y {MAX_GAME_NAME_LENGTH} caracteres.',
  [StringNames.Validation_GameNameRequired]: 'Se requiere un nombre de juego',
  [StringNames.Validation_GamePasswordRegexErrorTemplate]:
    'La contraseña del juego debe tener entre {MIN_GAME_PASSWORD_LENGTH} y {MAX_GAME_PASSWORD_LENGTH} caracteres',
  [StringNames.Validation_InvalidEmail]: 'Correo electrónica inválido',
  [StringNames.Validation_InvalidGame]:
    'ID de juego inválido o juego no existe.',
  [StringNames.Validation_InvalidGameCode]: 'Código de juego invático',
  [StringNames.Validation_InvalidGameCodeTemplate]:
    'El código del juego debe tener {GAME_CODE_LENGTH} caracteres',
  [StringNames.Validation_InvalidGameName]: 'Nombre de juego invático',
  [StringNames.Validation_InvalidGameNameTemplate]:
    'El nombre del juego debe tener entre {MIN_GAME_NAME_LENGTH} y {MAX_GAME_NAME_LENGTH} caracteres.',
  [StringNames.Validation_InvalidLanguage]: 'Idioma inválido',
  [StringNames.Validation_InvalidMessage]: 'Mensaje inválido',
  [StringNames.Validation_InvalidMaxChefsTemplate]:
    'El máximo de chefs debe estar entre {MIN_CHEFS} y {MAX_CHEFS}.',
  [StringNames.Validation_InvalidMaxChefsValueTemplate]:
    '{VALUE} no es un número válido de chefs! El máximo de chefs debe estar entre {MIN_CHEFS} y {MAX_CHEFS}.',
  [StringNames.Validation_InvalidTimezone]: 'Fuseau horaire invático',
  [StringNames.Validation_InvalidToken]: 'Token inválido',
  [StringNames.Validation_MaxChefsRequired]: 'Se requiere un número de chefs',
  [StringNames.Validation_MessageRegexErrorTemplate]:
    'El mensaje debe tener entre {MIN_MESSAGE_LENGTH} y {MAX_MESSAGE_LENGTH} caracteres.',
  [StringNames.Validation_PasswordRegexErrorTemplate]: `La contraseña debe estar entre {MIN_PASSWORD_LENGTH} y {MAX_PASSWORD_LENGTH} caracteres, y contener al menos:
  • Una letra minuscula (cualquier script)
  • Una letra mayúscula (cualquier script)
  • Un número (cualquier sistema numérico)
  • Un caracter especial (puntuación o símbolo)`,
  [StringNames.Validation_CurrentPasswordRequired]:
    'Se requiere la contraseña actual',
  [StringNames.Validation_PasswordsDifferent]:
    'La nueva contraseña debe ser diferente a la contraseña actual',
  [StringNames.Validation_NewPasswordRequired]:
    'Se requiere la nueva contraseña',
  [StringNames.Validation_PasswordMatch]:
    'La contraseña y la confirmación deben coincidir',
  [StringNames.Validation_ConfirmNewPassword]:
    'Se requiere la confirmación de la nueva contraseña',
  [StringNames.Validation_Required]: 'Requerido',
  [StringNames.Validation_UsernameRegexErrorTemplate]: `El nombre de usuario debe tener entre {MIN_USERNAME_LENGTH} y {MAX_USERNAME_LENGTH} caracteres, y:
  • Comenzar con una letra, un número, o un carácter Unicode
  • Puede contener letras, números, guiones bajos, guiones, y carácteres Unicode
  • No puede contener espacios o carácteres especiales excepto guiones bajos y guiones`,
  [StringNames.VerifyEmail_Success]: 'Correo electrónica verificado con éxito',
  [StringNames.TEST_TESTTEMPLATE]: 'Probando {VARIABLE1} {VARIABLE2}',
};

export default SpanishStrings;
