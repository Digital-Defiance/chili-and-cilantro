// src/app/menuContext.tsx
import { StringNames } from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Dashboard as DashboardIcon,
  LockOpen as LockOpenIcon,
  Login as LoginIcon,
  ExitToApp as LogoutIcon,
  PersonAdd as PersonAddIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useAppTranslation } from './i18n-provider';

import { useLocation } from 'react-router-dom';
import { IMenuOption } from './interfaces/menu-option';

import { useAuth } from './auth-provider';
import { IncludeOnMenu } from './enumerations/include-on-menu';

interface MenuProviderProps {
  children: React.ReactNode;
}

interface MenuContextType {
  menuOptions: IMenuOption[];
  getMenuOptions: (menuType: IncludeOnMenu) => IMenuOption[];
  registerMenuOption: (option: IMenuOption) => () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const { t } = useAppTranslation();
  const [registeredOptions, setRegisteredOptions] = useState<IMenuOption[]>([]);
  const location = useLocation(); // Get location inside the callback
  const { isAuthenticated } = useAuth(); // Get isAuthenticated inside the callback

  const registerMenuOption = useCallback((option: IMenuOption) => {
    setRegisteredOptions((prevOptions) => {
      const existingOptionIndex = prevOptions.findIndex(
        (o) => o.id === option.id,
      );
      if (existingOptionIndex !== -1) {
        // Replace the existing option
        const newOptions = [...prevOptions];
        newOptions[existingOptionIndex] = option;
        return newOptions;
      } else {
        // Add new option
        return [...prevOptions, option];
      }
    });

    return () => {
      setRegisteredOptions((prevOptions) =>
        prevOptions.filter((o) => o.id !== option.id),
      );
    };
  }, []);

  const menuOptions = useMemo(() => {
    const baseOptions: IMenuOption[] = [
      {
        id: 'dashboard',
        label: t(StringNames.Common_Dashboard),
        icon: <DashboardIcon />,
        link: '/dashboard',
        requiresAuth: true,
        includeOnMenus: [IncludeOnMenu.SideMenu],
        index: 0,
      },
      {
        id: 'user-divider',
        label: '',
        divider: true,
        includeOnMenus: [IncludeOnMenu.SideMenu],
        index: 1,
        requiresAuth: false,
      },
      {
        id: 'change-password',
        label: t(StringNames.Common_ChangePassword),
        icon: <VpnKeyIcon />,
        link: '/change-password',
        requiresAuth: true,
        includeOnMenus: [IncludeOnMenu.UserMenu, IncludeOnMenu.SideMenu],
        index: 2,
      },
      {
        id: 'logout',
        label: t(StringNames.LogoutButton),
        icon: <LogoutIcon />,
        link: '/logout',
        requiresAuth: true,
        includeOnMenus: [IncludeOnMenu.UserMenu, IncludeOnMenu.SideMenu],
        index: 3,
      },
      {
        id: 'login',
        label: t(StringNames.Login_LoginButton),
        icon: <LoginIcon />,
        link: '/login',
        requiresAuth: false,
        includeOnMenus: [IncludeOnMenu.UserMenu, IncludeOnMenu.SideMenu],
        index: 4,
      },
      {
        id: 'register',
        label: t(StringNames.RegisterButton),
        icon: <PersonAddIcon />,
        link: '/register',
        requiresAuth: false,
        includeOnMenus: [IncludeOnMenu.UserMenu, IncludeOnMenu.SideMenu],
        index: 5,
      },
      {
        id: 'forgot-password',
        label: t(StringNames.ForgotPassword_Title),
        icon: <LockOpenIcon />,
        link: '/forgot-password',
        requiresAuth: false,
        includeOnMenus: [IncludeOnMenu.UserMenu, IncludeOnMenu.SideMenu],
        index: 6,
      },
      {
        id: 'game-divider',
        label: '',
        divider: true,
        includeOnMenus: [IncludeOnMenu.SideMenu],
        index: 7,
        requiresAuth: false,
      },
      {
        id: 'create-game',
        label: t(StringNames.Game_CreateGame),
        link: '/cook/create',
        icon: <i className="fa-duotone fa-utensils" />,
        requiresAuth: true,
        includeOnMenus: [IncludeOnMenu.GameMenu, IncludeOnMenu.SideMenu],
        index: 8,
      },
      {
        id: 'join-game',
        label: t(StringNames.Game_JoinGame),
        link: '/cook/join',
        icon: <i className="fa-duotone fa-hat-chef" />,
        requiresAuth: true,
        includeOnMenus: [IncludeOnMenu.GameMenu, IncludeOnMenu.SideMenu],
        index: 9,
      },
    ];

    const allOptions = [...baseOptions, ...registeredOptions];
    return allOptions.sort((a, b) => a.index - b.index);
  }, [t, registeredOptions]);

  const getMenuOptions = useCallback(
    (menuType: IncludeOnMenu, includeDividers = false) => {
      const MenuFilter = (o: IMenuOption) => {
        // Apply the custom filter first
        const customFilterPasses = o.filter === undefined || o.filter(o);
        if (!customFilterPasses) return false;

        if (o.divider === true && !includeDividers) return false;

        const routeMatch =
          o.routePattern === undefined ||
          o.routePattern.test(location.pathname);

        return (
          routeMatch &&
          o.includeOnMenus.includes(menuType) &&
          (o.requiresAuth === undefined || o.requiresAuth === isAuthenticated)
        );
      };

      return menuOptions.filter(
        (o) => MenuFilter(o) && (includeDividers || o.divider === undefined),
      );
    },
    [menuOptions, isAuthenticated, location],
  );

  const contextValue = useMemo(() => {
    return {
      menuOptions: menuOptions,
      getMenuOptions: getMenuOptions,
      registerMenuOption: registerMenuOption,
    };
  }, [menuOptions, getMenuOptions, registerMenuOption]);

  const memoizedChildren = useMemo(() => children, [children]);
  return (
    <MenuContext.Provider value={contextValue}>
      {memoizedChildren}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
