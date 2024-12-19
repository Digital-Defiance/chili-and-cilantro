import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = 'Chili y Cilantro';

export const SpanishStrings: StringsCollection = {
  [StringNames.AccountError_Message]:
    'Parece que hay un problema con tu cuenta. Por favor, contacta con soporte.',
  [StringNames.AccountError_Title]: 'Error de cuenta',
  [StringNames.ChangePassword_ChangePasswordButton]: 'Cambiar contraseña',
  [StringNames.Common_ChangePassword]: 'Cambiar contraseña',
  [StringNames.Common_ConfirmNewPassword]: 'Confirmar nueva contraseña',
  [StringNames.Common_CurrentPassword]: 'Contraseña actual',
  [StringNames.Common_Email]: 'Correo electrónica',
  [StringNames.Common_GoToSplash]: 'Volver a la pantalla de bienvenida',
  [StringNames.Common_NewPassword]: 'Nueva contraseña',
  [StringNames.Common_Dashboard]: 'Tablero',
  [StringNames.Common_Loading]: 'Cargando...',
  [StringNames.Common_Logo]: 'logo',
  [StringNames.Common_Password]: 'Contraseña',
  [StringNames.Common_ReturnToKitchen]: 'Volver a la Cocina',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Comenzar a cocinar',
  [StringNames.Common_Tagline]: 'Un Juego de Bluff Picante',
  [StringNames.Common_Unauthorized]: 'No autorizado',
  [StringNames.Common_UnexpectedError]: 'Error inesperado',
  [StringNames.Common_Username]: 'Nombre de usuario',
  [StringNames.Error_AccountStatusIsDeleted]: 'Cuenta eliminada',
  [StringNames.Error_AccountStatusIsLocked]: 'Cuenta bloqueada',
  [StringNames.Error_AccountStatusIsPendingEmailVerification]:
    'Cuenta en espera de verificación de correo electrónico',
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
  [StringNames.Game_JoinGame]: 'Unirse al juego',
  [StringNames.Game_JoinGameSuccess]: 'Juego unido con éxito',
  [StringNames.Game_ListSuccess]: 'Lista de juegos recuperada con éxito',
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
  [StringNames.LanguageUpdate_Success]: 'Idioma actualizado con éxito',
  [StringNames.Login_LoginButton]: 'Iniciar sesión',
  [StringNames.Login_Progress]: 'Iniciando sesión...',
  [StringNames.Login_ResentPasswordFailure]: 'Reenviar contraseña fallido',
  [StringNames.Login_ResentPasswordSuccess]: 'Reenviar contraseña con éxito',
  [StringNames.Login_Title]: 'Iniciar sesión',
  [StringNames.Login_UsernameOrEmailRequired]:
    'Se requiere un nombre de usuario o correo electrónica',
  [StringNames.LogoutButton]: 'Cerrar sesión',
  [StringNames.RegisterButton]: 'Registrarse',
  [StringNames.Splash_Description]:
    'En Chili and Cilantro, los aspirantes a chef compiten para crear el plato perfecto. Tu objetivo es agregar la cantidad justa de cilantro sin arruinarlo con un chile abrasador. ¡Sé el primero en condimentar con éxito dos platos o sé el último chef en pie para ganar!',
  [StringNames.Splash_HowToPlay]: 'Como Jugar',
  [StringNames.ValidationError]: 'Error de validación',
  [StringNames.Validation_InvalidEmail]: 'Correo electrónica inválido',
  [StringNames.Validation_InvalidLanguage]: 'Idioma inválido',
  [StringNames.Validation_InvalidTimezone]: 'Fuseau horaire invático',
  [StringNames.Validation_InvalidToken]: 'Token inválido',
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
};

export default SpanishStrings;
