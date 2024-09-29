import { StringNames } from '../enumerations/string-names';
import { StringsCollection } from '../shared-types';

const site = 'Piment et Coriandre';

export const FrenchStrings: StringsCollection = {
  [StringNames.ChangePassword_ChangePasswordButton]: 'Changer le mot de passe',
  [StringNames.Common_ChangePassword]: 'Changer le mot de passe',
  [StringNames.Common_ConfirmNewPassword]: 'Confirmer le nouveau mot de passe',
  [StringNames.Common_CurrentPassword]: 'Mot de passe actuel',
  [StringNames.Common_NewPassword]: 'Nouveau mot de passe',
  [StringNames.Common_Dashboard]: 'Tableau de bord',
  [StringNames.Common_Loading]: 'Chargement...',
  [StringNames.Common_Logo]: 'logo',
  [StringNames.Common_ReturnToKitchen]: 'Retour à la Cuisine',
  [StringNames.Common_Site]: site,
  [StringNames.Common_StartCooking]: 'Commencer la Cuisine',
  [StringNames.Common_Tagline]: 'Un Jeu de Bluff Épicé',
  [StringNames.Common_Unauthorized]: 'Non autorisé',
  [StringNames.Common_UnexpectedError]: 'Erreur inattendue',
  [StringNames.ForgotPassword_Title]: 'Mot de passe oublié',
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
  [StringNames.LogoutButton]: 'Déconnexion',
  [StringNames.RegisterButton]: "S'inscrire",
  [StringNames.Splash_Description]:
    "Dans Chili and Cilantro, les chefs en herbe rivalisent pour créer le plat parfait. Votre objectif est d'ajouter juste la bonne quantité de coriandre sans gâcher le tout avec un piment brûlant. Soyez le premier à réussir à assaisonner deux plats ou soyez le dernier chef debout pour gagner !",
  [StringNames.Splash_HowToPlay]: 'Comment Jouer',
  [StringNames.ValidationError]: 'Erreur de validation',
  [StringNames.Validation_InvalidLanguage]: 'Langue invalide',
  [StringNames.Validation_InvalidToken]: 'Jeton invalide',
  [StringNames.Validation_PasswordRegexError]:
    'Le mot de passe doit comporter au moins 8 caractères et inclure au moins une lettre, un chiffre et un caractère spécial (!@#$%^&*()_+-=[]{};\':"|,.<>/?)',
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
};

export default FrenchStrings;
