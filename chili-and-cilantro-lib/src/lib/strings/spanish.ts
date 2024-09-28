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
  [StringNames.Common_GoToSplash]: 'Volver a la pantalla de bienvenida',
  [StringNames.Common_NewPassword]: 'Nueva contraseña',
  [StringNames.Common_Dashboard]: 'Tablero',
  [StringNames.Common_Loading]: 'Cargando...',
  [StringNames.Common_Logo]: 'logo',
  [StringNames.Common_ReturnToKitchen]: 'Volver a la Cocina',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Comenzar a cocinar',
  [StringNames.Common_Tagline]: 'Un Juego de Bluff Picante',
  [StringNames.Common_Unauthorized]: 'No autorizado',
  [StringNames.Common_UnexpectedError]: 'Error inesperado',
  [StringNames.Dashboard_GamesCreated]: 'Juegos que has creado',
  [StringNames.Dashboard_GamesParticipating]: 'Juegos en los que participas',
  [StringNames.Dashboard_NoGames]: 'No hay juegos disponibles.',
  [StringNames.Dashboard_Title]: 'Tu Tablero',
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
  [StringNames.LogoutButton]: 'Cerrar sesión',
  [StringNames.RegisterButton]: 'Registrarse',
  [StringNames.Splash_Description]:
    'En Chili and Cilantro, los aspirantes a chef compiten para crear el plato perfecto. Tu objetivo es agregar la cantidad justa de cilantro sin arruinarlo con un chile abrasador. ¡Sé el primero en condimentar con éxito dos platos o sé el último chef en pie para ganar!',
  [StringNames.Splash_HowToPlay]: 'Como Jugar',
  [StringNames.ValidationError]: 'Error de validación',
  [StringNames.Validation_InvalidEmail]: 'Correo electrónica inválido',
  [StringNames.Validation_InvalidLanguage]: 'Idioma inválido',
  [StringNames.Validation_InvalidToken]: 'Token inválido',
  [StringNames.Validation_PasswordRegexError]:
    'La contraseña debe tener al menos 8 caracteres y incluir al menos una letra, un número y un carácter especial (!@#$%^&*()_+-=[]{};\':"|,.<>/?)',
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
};

export default SpanishStrings;
