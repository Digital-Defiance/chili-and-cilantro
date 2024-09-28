import { AccountStatusTypeEnum } from '../enumerations/account-status-type';
import { StringLanguages } from '../enumerations/string-languages';

export type AccountStatusTypeTranslation = {
  [key in AccountStatusTypeEnum]: string;
};
export type AccountStatusTypeLanguageTranslation = {
  [key in StringLanguages]: AccountStatusTypeTranslation;
};

export const AccountStatusTypeTranslations: AccountStatusTypeLanguageTranslation =
  {
    [StringLanguages.EnglishUS]: {
      [AccountStatusTypeEnum.NewUnverified]: 'New and unverified',
      [AccountStatusTypeEnum.Active]: 'Active',
      [AccountStatusTypeEnum.AdminDelete]: 'Deleted by an administrator',
      [AccountStatusTypeEnum.SelfDeleteWaitPeriod]: 'Deleted by user (pending)',
      [AccountStatusTypeEnum.SelfDelete]: 'Deleted by user',
      [AccountStatusTypeEnum.Locked]: 'Locked',
    },
    [StringLanguages.EnglishUK]: {
      [AccountStatusTypeEnum.NewUnverified]: 'New and unverified',
      [AccountStatusTypeEnum.Active]: 'Active',
      [AccountStatusTypeEnum.AdminDelete]: 'Deleted by an administrator',
      [AccountStatusTypeEnum.SelfDeleteWaitPeriod]: 'Deleted by user (pending)',
      [AccountStatusTypeEnum.SelfDelete]: 'Deleted by user',
      [AccountStatusTypeEnum.Locked]: 'Locked',
    },
    [StringLanguages.French]: {
      [AccountStatusTypeEnum.NewUnverified]: 'Nouveau et non vérifié',
      [AccountStatusTypeEnum.Active]: 'Actif',
      [AccountStatusTypeEnum.AdminDelete]: 'Supprimé par un administrateur',
      [AccountStatusTypeEnum.SelfDeleteWaitPeriod]:
        'Supprimé par l’utilisateur (en attente)',
      [AccountStatusTypeEnum.SelfDelete]: 'Supprimé par l’utilisateur',
      [AccountStatusTypeEnum.Locked]: 'Verrouillé',
    },
    [StringLanguages.MandarinChinese]: {
      [AccountStatusTypeEnum.NewUnverified]: '新且未验证',
      [AccountStatusTypeEnum.Active]: '活跃',
      [AccountStatusTypeEnum.AdminDelete]: '由管理员删除',
      [AccountStatusTypeEnum.SelfDeleteWaitPeriod]: '由用户删除（待定）',
      [AccountStatusTypeEnum.SelfDelete]: '由用户删除',
      [AccountStatusTypeEnum.Locked]: '已锁定',
    },
    [StringLanguages.Spanish]: {
      [AccountStatusTypeEnum.NewUnverified]: 'Nuevo y no verificado',
      [AccountStatusTypeEnum.Active]: 'Activo',
      [AccountStatusTypeEnum.AdminDelete]: 'Eliminado por un administrador',
      [AccountStatusTypeEnum.SelfDeleteWaitPeriod]:
        'Eliminado por el usuario (pendiente)',
      [AccountStatusTypeEnum.SelfDelete]: 'Eliminado por el usuario',
      [AccountStatusTypeEnum.Locked]: 'Bloqueado',
    },
    [StringLanguages.Ukrainian]: {
      [AccountStatusTypeEnum.NewUnverified]: 'Новий і неверифікований',
      [AccountStatusTypeEnum.Active]: 'Активний',
      [AccountStatusTypeEnum.AdminDelete]: 'Видалено адміністратором',
      [AccountStatusTypeEnum.SelfDeleteWaitPeriod]:
        'Видалено користувачем (очікується)',
      [AccountStatusTypeEnum.SelfDelete]: 'Видалено користувачем',
      [AccountStatusTypeEnum.Locked]: 'Заблоковано',
    },
  };
