import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = 'Piment et Coriandre';

export const FrenchStrings: StringsCollection = {
  [StringNames.AccountError_Message]:
    'Il semble y avoir un problème avec votre compte. Veuillez contacter le support.',
  [StringNames.AccountError_Title]: 'Erreur de compte',
  [StringNames.ChangePassword_ChangePasswordButton]: 'Changer le mot de passe',
  [StringNames.Common_ChangePassword]: 'Changer le mot de passe',
  [StringNames.Common_ConfirmNewPassword]: 'Confirmer le nouveau mot de passe',
  [StringNames.Common_CurrentPassword]: 'Mot de passe actuel',
  [StringNames.Common_GoToSplash]: "Retourner aucran d'accueil",
  [StringNames.Common_NewPassword]: 'Nouveau mot de passe',
  [StringNames.Common_Dashboard]: 'Tableau de bord',
  [StringNames.Common_Email]: 'Courriel',
  [StringNames.Common_Loading]: 'Chargement...',
  [StringNames.Common_Logo]: 'logo',
  [StringNames.Common_Password]: 'Mot de passe',
  [StringNames.Common_ReturnToKitchen]: 'Retour à la Cuisine',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Commencer la Cuisine',
  [StringNames.Common_Tagline]: 'Un Jeu de Bluff Épicé',
  [StringNames.Common_Unauthorized]: 'Non autorisé',
  [StringNames.Common_UnexpectedError]: 'Erreur inattendue',
  [StringNames.Common_Username]: 'Nom d’utilisateur',
  [StringNames.Error_AccountStatusIsDeleted]: 'Compte supprimé',
  [StringNames.Error_AccountStatusIsLocked]: 'Compte verrouillé',
  [StringNames.Error_AccountStatusIsPendingEmailVerification]:
    'Compte en attente de confirmation de courriel',
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
  [StringNames.Game_JoinGame]: 'Rejoindre un Jeu',
  [StringNames.Game_JoinGameSuccess]: 'Jeu rejoint avec succès',
  [StringNames.Game_ListSuccess]: 'Liste de jeux récupérée avec succès',
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
  [StringNames.LanguageUpdate_Success]: 'Langue mise à jour avec succès',
  [StringNames.Login_LoginButton]: 'Connexion',
  [StringNames.Login_Progress]: 'Connexion en cours...',
  [StringNames.Login_ResentPasswordFailure]:
    'Échec de l’envoi du courriel de verification',
  [StringNames.Login_ResentPasswordSuccess]:
    'Courriel de verification envoyé avec успех',
  [StringNames.Login_Title]: 'Connexion',
  [StringNames.Login_UsernameOrEmailRequired]:
    'Nom d’utilisateur ou courriel requis',
  [StringNames.LogoutButton]: 'Déconnexion',
  [StringNames.RegisterButton]: "S'inscrire",
  [StringNames.Splash_Description]:
    "Dans Chili and Cilantro, les chefs en herbe rivalisent pour créer le plat parfait. Votre objectif est d'ajouter juste la bonne quantité de coriandre sans gâcher le tout avec un piment brûlant. Soyez le premier à réussir à assaisonner deux plats ou soyez le dernier chef debout pour gagner !",
  [StringNames.Splash_HowToPlay]: 'Comment Jouer',
  [StringNames.ValidationError]: 'Erreur de validation',
  [StringNames.Validation_InvalidEmail]: 'Courriel invalide',
  [StringNames.Validation_InvalidLanguage]: 'Langue invalide',
  [StringNames.Validation_InvalidTimezone]: 'Fuseau horaire invalide',
  [StringNames.Validation_InvalidToken]: 'Jeton invalide',
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
};

export default FrenchStrings;
