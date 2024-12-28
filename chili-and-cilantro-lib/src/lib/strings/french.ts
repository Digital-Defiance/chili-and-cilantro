import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = 'Piment et Coriandre';

export const FrenchStrings: StringsCollection = {
  [StringNames.AccountError_Message]:
    'Il semble y avoir un problème avec votre compte. Veuillez contacter le support.',
  [StringNames.AccountError_Title]: 'Erreur de compte',
  [StringNames.ChangePassword_ChangePasswordButton]: 'Changer le mot de passe',
  [StringNames.ChangePassword_Success]: 'Mot de passe changé avec succès',
  [StringNames.Common_ChangePassword]: 'Changer le mot de passe',
  [StringNames.Common_CheckingAuthentication]:
    'Vérification de l’authentification',
  [StringNames.Common_Chef]: 'Chef',
  [StringNames.Common_ConfirmNewPassword]: 'Confirmer le nouveau mot de passe',
  [StringNames.Common_CurrentPassword]: 'Mot de passe actuel',
  [StringNames.Common_GoToSplash]: "Retourner aucran d'accueil",
  [StringNames.Common_NewPassword]: 'Nouveau mot de passe',
  [StringNames.Common_Dashboard]: 'Tableau de bord',
  [StringNames.Common_DisplayName]: 'Nom d’utilisateur',
  [StringNames.Common_Email]: 'Courriel',
  [StringNames.Common_Game]: 'Jeu',
  [StringNames.Common_GameCode]: 'Code de jeu',
  [StringNames.Common_GameName]: 'Nom du jeu',
  [StringNames.Common_GamePassword]: 'Mot de passe du jeu',
  [StringNames.Common_Kitchen]: 'Cuisine',
  [StringNames.Common_Loading]: 'Chargement...',
  [StringNames.Common_Logo]: 'logo',
  [StringNames.Common_MasterChef]: 'Chef de cuisine',
  [StringNames.Common_MaxChefs]: 'Nombre maximum de chefs',
  [StringNames.Common_Optional]: 'Optionnel',
  [StringNames.Common_Password]: 'Mot de passe',
  [StringNames.Common_ReturnToKitchen]: 'Retour à la Cuisine',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Commencer la Cuisine',
  [StringNames.Common_Success]: 'Succès',
  [StringNames.Common_Tagline]: 'Un Jeu de Bluff Épicé',
  [StringNames.Common_TokenRefreshed]: 'Jeton réglé',
  [StringNames.Common_TokenValid]: 'Jeton valide',
  [StringNames.Common_Unauthorized]: 'Non autorisé',
  [StringNames.Common_UnexpectedError]: 'Erreur inattendue',
  [StringNames.Common_Username]: 'Nom d’utilisateur',
  [StringNames.EmailToken_ExpiresInTemplate]:
    'Le lien expire dans {EMAIL_TOKEN_EXPIRATION_MIN} minutes.',
  [StringNames.EmailToken_TitleEmailConfirm]: 'Confirmation de courriel',
  [StringNames.EmailToken_TitleResetPassword]:
    'Réinitialisation du mot de passe',
  [StringNames.EmailToken_ClickLinkEmailConfirm]:
    'Veuillez cliquer sur le lien ci-dessous pour confirmer votre courriel.',
  [StringNames.EmailToken_ClickLinkResetPassword]:
    'Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe.',
  [StringNames.Error_AccountStatusIsDeleted]: 'Compte supprimé',
  [StringNames.Error_AccountStatusIsLocked]: 'Compte verrouillé',
  [StringNames.Error_AccountStatusIsPendingEmailVerification]:
    'Compte en attente de confirmation de courriel',
  [StringNames.Error_AllCardsPlaced]: 'Toutes les cartes ont été placées',
  [StringNames.Error_ChefAlreadyInGame]: 'Chef deja dans le jeu',
  [StringNames.Error_EmailAlreadyVerified]: 'Courriel déjà vérifié',
  [StringNames.Error_EmailInUse]: 'Courriel déjà utilisé',
  [StringNames.Error_EmailTokenAlreadyUsed]:
    'Le lien de vérification par courriel a déjà été utilisé ou est invalide',
  [StringNames.Error_EmailTokenExpired]:
    'Le lien de vérification a expiré. Veuillez en demander un nouveau.',
  [StringNames.Error_EmailTokenSentTooRecentlyTemplate]:
    'Le jeton de courrier électronique a été envoyé trop récemment. Veuillez réessayer dans {TIME_REMAINING} secondes.',
  [StringNames.Error_FailedToCreateEmailToken]:
    'Échec de la création du jeton par courriel',
  [StringNames.Error_GameAlreadyInProgress]: 'Le jeu est déjà en cours.',
  [StringNames.Error_GameDisplayNameAlreadyInUse]:
    'Le nom est déjà utilisé dans ce jeu.',
  [StringNames.Error_GameEnded]: 'Le jeu est terminé',
  [StringNames.Error_GameInvalidPhase]:
    'Le jeu n’est pas dans la phase correcte pour cette action.',
  [StringNames.Error_GamePasswordMismatch]:
    'Le mot de passe du jeu ne correspond pas.',
  [StringNames.Error_InvalidAction]: 'Action invalide',
  [StringNames.Error_InvalidCredentials]: 'Identifiants invalides',
  [StringNames.Error_InvalidEndGameReason]: 'Raison de fin de jeu invalide',
  [StringNames.Error_MustBeMasterChef]:
    'Vous devez être le chef de cuisine pour effectuer cette action.',
  [StringNames.Error_NotEnoughChefsTemplate]:
    'Pas assez de chefs pour commencer le jeu. {CHEFS_PRESENT}/{MIN_CHEFS}',
  [StringNames.Error_NotFound]: 'Introuvable',
  [StringNames.Error_NotInGame]: 'Vous n’êtes pas dans ce jeu.',
  [StringNames.Error_NotLoggedIn]: 'Vous n’êtes pas connecté',
  [StringNames.Error_NotYourTurn]: 'Ce n’est pas votre tour.',
  [StringNames.Error_OutOfIngredientTemplate]: 'Plus de {INGREDIENT}.',
  [StringNames.Error_SendTokenFailure]:
    'Échec de l’envoi du jeton par courriel',
  [StringNames.Error_TooManyChefs]: 'Trop de chefs dans la cuisine',
  [StringNames.Error_UnexpectedTurnActionTemplate]:
    'Action de tour inattendue: {TURN_ACTION}.',
  [StringNames.Error_UsernameInUse]: 'Nom d’utilisateur déjà utilisé',
  [StringNames.Error_UserNotFound]: 'Utilisateur non trouvé',
  [StringNames.Error_YouAlreadyJoined]: 'Vous avez déjà rejoint ce jeu',
  [StringNames.Dashboard_GamesCreated]: 'Jeux que vous avez créé',
  [StringNames.Dashboard_GamesParticipating]: 'Jeux que vous participez',
  [StringNames.Dashboard_NoGames]: 'Aucun jeu disponible.',
  [StringNames.Dashboard_Title]: 'Votre Tableau de Bord',
  [StringNames.ForgotPassword_ForgotPassword]: 'Mot de passe oublié',
  [StringNames.ForgotPassword_InvalidToken]:
    'Jeton invalide ou expiré. Veuillez demander un nouveau mot de passe.',
  [StringNames.ForgotPassword_ResetPassword]: 'Réinitialiser le mot de passe',
  [StringNames.ForgotPassword_SendResetToken]:
    'Envoyer le mot de passe par courriel',
  [StringNames.ForgotPassword_Success]:
    'Votre mot de passe a bien été changé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
  [StringNames.ForgotPassword_Title]: 'Mot de passe oublié',
  [StringNames.Game_CreateGame]: 'Créer un Jeu',
  [StringNames.Game_CreateGameSuccess]: 'Jeu créé avec succès',
  [StringNames.Game_EndGame]: 'Terminer le Jeu',
  [StringNames.Game_JoinGame]: 'Rejoindre un Jeu',
  [StringNames.Game_JoinGameSuccess]: 'Jeu rejoint avec succès',
  [StringNames.KeyFeatures_Title]: 'Caractéristiques Principales',
  [StringNames.KeyFeatures_1]:
    'Un jeu de bluff passionnant avec une touche culinaire',
  [StringNames.KeyFeatures_2]: 'Enchères stratégiques et placement de cartes',
  [StringNames.KeyFeatures_3]: 'Rapide à apprendre, difficile à maîtriser',
  [StringNames.KeyFeatures_4]: 'Prend en charge 2 joueurs ou plus',
  [StringNames.KeyFeatures_5]:
    'Rondes de retournement de cartes pleines de suspense',
  [StringNames.KeyFeatures_6]:
    'Gestion des risques : évitez le redoutable chili !',
  [StringNames.KeyFeatures_7]:
    'Le premier à assaisonner deux plats ou le dernier chef debout gagne',
  [StringNames.KeyFeatures_8]:
    'Parfait pour les soirées de jeux et les réunions de famille',
  [StringNames.LetsCook_AddChef]: 'Ajouter Chef',
  [StringNames.LetsCook_RemoveChef]: 'Retirer Chef',
  [StringNames.LetsCook_Title]: 'Cuisinons',
  [StringNames.LanguageUpdate_Success]: 'Langue mise à jour avec succès',
  [StringNames.Login_LoginButton]: 'Connexion',
  [StringNames.Login_NoAccountSignUp]: "Vous n'avez pas de compte? S'inscrire",
  [StringNames.Login_Progress]: 'Connexion en cours...',
  [StringNames.Login_ResendPasswordLink]:
    'Renvoyer le courriel de verification',
  [StringNames.Login_ResentPasswordFailure]:
    'Échec de l’envoi du courriel de verification',
  [StringNames.Login_ResentPasswordSuccess]:
    'Courriel de verification envoyé avec успех',
  [StringNames.Login_Title]: 'Connexion',
  [StringNames.Login_UseEmail]: 'Utiliser Courriel',
  [StringNames.Login_UseUsername]: 'Utiliser Nom d’utilisateur',
  [StringNames.Login_UsernameOrEmailRequired]:
    'Nom d’utilisateur ou courriel requis',
  [StringNames.LogoutButton]: 'Déconnexion',
  [StringNames.RegisterButton]: "S'inscrire",
  [StringNames.Register_LoginLink]: 'Déjà un compte? Connexion',
  [StringNames.Register_Progress]: 'Inscription en cours...',
  [StringNames.Register_Success]:
    'Inscription réussie! Redirection vers la page de connexion...',
  [StringNames.Register_Title]: 'S’inscrire',
  [StringNames.ResetPassword_ChangeEmailFirst]:
    'Vous devez changer votre courriel avant de pouvoir changer votre mot de passe.',
  [StringNames.ResetPassword_Sent]:
    'Si un compte avec cet courriel existe, un lien de réinitialisation du mot de passe a été envoyé.',
  [StringNames.ResetPassword_Success]:
    'Réinitialisation du mot de passe réussie',
  [StringNames.Splash_Description]:
    "Dans Chili and Cilantro, les chefs en herbe rivalisent pour créer le plat parfait. Votre objectif est d'ajouter juste la bonne quantité de coriandre sans gâcher le tout avec un piment brûlant. Soyez le premier à réussir à assaisonner deux plats ou soyez le dernier chef debout pour gagner !",
  [StringNames.Splash_HowToPlay]: 'Comment Jouer',
  [StringNames.ValidationError]: 'Erreur de validation',
  [StringNames.Validation_DisplayNameRegexErrorTemplate]:
    'Le nom d’utilisateur doit contenir entre {MIN_USER_DISPLAY_NAME_LENGTH} et {MAX_USER_DISPLAY_NAME_LENGTH} caractères',
  [StringNames.Validation_DisplayNameRequired]: 'Nom d’utilisateur requis',
  [StringNames.Validation_InvalidEmail]: 'Courriel invalide',
  [StringNames.Validation_InvalidGameCode]: 'Code de jeu invalide',
  [StringNames.Validation_InvalidGameCodeTemplate]:
    'Le code de jeu doit contenir {GAME_CODE_LENGTH} caractères',
  [StringNames.Validation_GameCodeRequired]: 'Code de jeu requis',
  [StringNames.Validation_GameNameRegexErrorTemplate]:
    'Le nom du jeu doit contenir entre {MIN_GAME_NAME_LENGTH} et {MAX_GAME_NAME_LENGTH} caractères.',
  [StringNames.Validation_GameNameRequired]: 'Nom du jeu requis',
  [StringNames.Validation_GamePasswordRegexErrorTemplate]:
    'Le mot de passe du jeu doit contenir entre {MIN_GAME_PASSWORD_LENGTH} et {MAX_GAME_PASSWORD_LENGTH} caractères',
  [StringNames.Validation_InvalidGame]: 'ID de jeu invalide ou jeu inexistant.',
  [StringNames.Validation_InvalidGameName]: 'Nom de jeu invalide',
  [StringNames.Validation_InvalidGameNameTemplate]:
    'Le nom du jeu doit contenir entre {MIN_GAME_NAME_LENGTH} et {MAX_GAME_NAME_LENGTH} caractères.',
  [StringNames.Validation_InvalidLanguage]: 'Langue invalide',
  [StringNames.Validation_InvalidMessage]: 'Message invalide',
  [StringNames.Validation_InvalidTimezone]: 'Fuseau horaire invalide',
  [StringNames.Validation_InvalidToken]: 'Jeton invalide',
  [StringNames.Validation_InvalidMaxChefsTemplate]:
    'Le nombre maximum de chefs doit être compris entre {MIN_CHEFS} et {MAX_CHEFS}.',
  [StringNames.Validation_InvalidMaxChefsValueTemplate]:
    '{VALUE} n’est pas un nombre de chefs valide ! Le nombre maximum de chefs doit être compris entre {MIN_CHEFS} et {MAX_CHEFS}.',
  [StringNames.Validation_MaxChefsRequired]: 'Le nombre de chefs est requis',
  [StringNames.Validation_MessageRegexErrorTemplate]:
    'Le message doit contenir entre {MIN_MESSAGE_LENGTH} et {MAX_MESSAGE_LENGTH} caractères.',
  [StringNames.Validation_PasswordRegexErrorTemplate]: `Le mot de passe doit contenir entre {MIN_PASSWORD_LENGTH} et {MAX_PASSWORD_LENGTH} caractères, et contenir au moins :
  • Une lettre minuscule (tout script)
  • Une lettre majuscule (tout script)
  • Un chiffre (tout système numérique)
  • Un caractère spécial (ponctuation ou symbole)`,
  [StringNames.Validation_CurrentPasswordRequired]:
    'Le mot de passe actuel est requis',
  [StringNames.Validation_PasswordsDifferent]:
    'Le nouveau mot de passe doit être différent du mot de passe actuel',
  [StringNames.Validation_NewPasswordRequired]:
    'Le nouveau mot de passe est requis',
  [StringNames.Validation_PasswordMatch]:
    'Le mot de passe et la confirmation doivent correspondre',
  [StringNames.Validation_ConfirmNewPassword]:
    'La confirmation du nouveau mot de passe est requise',
  [StringNames.Validation_Required]: 'Champ obligatoire',
  [StringNames.Validation_UsernameRegexErrorTemplate]: `Le nom d'utilisateur doit contenir entre {MIN_USERNAME_LENGTH} et {MAX_USERNAME_LENGTH} caractères, et :
  • Commencer par une lettre, un chiffre, ou un caractère Unicode
  • Peut contenir des lettres, des chiffres, des underscores, des tirets, et des caractères Unicode
  • Ne peut contenir des espaces ou des caractères spéciaux autre que des underscores et des tirets`,
  [StringNames.VerifyEmail_Success]: 'Courriel vérifié avec succès',
  [StringNames.TEST_TESTTEMPLATE]: 'Essai {VARIABLE1} {VARIABLE2}',
};

export default FrenchStrings;
