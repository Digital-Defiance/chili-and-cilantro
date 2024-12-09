// src/app/menuContext.tsx
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

export type GameMenuOption = {
  id: string;
  label: string;
  icon?: ReactNode;
  link?: string;
  action?: () => void;
  isGlobal?: boolean;
};

interface MenuProviderProps {
  children: React.ReactNode;
}

interface MenuContextType {
  gameOptions: GameMenuOption[];
  addGameOptions: (newOptions: GameMenuOption[]) => void;
  setContextOptions: (newOptions: GameMenuOption[]) => void;
  resetToGlobalOptions: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const initialGameOptions: GameMenuOption[] = [
    {
      id: 'create-game',
      label: 'Create Game',
      action: () => navigate('/create-game'),
      isGlobal: true,
    },
  ];
  const [globalOptions, setGlobalOptions] =
    useState<GameMenuOption[]>(initialGameOptions);
  const [contextOptions, setContextOptions] = useState<GameMenuOption[]>([]);

  const addGameOptions = useCallback((newOptions: GameMenuOption[]) => {
    setGlobalOptions((prevOptions) => [
      ...prevOptions,
      ...newOptions.filter((o) => o.isGlobal),
    ]);
    setContextOptions(newOptions);
  }, []);

  const resetToGlobalOptions = useCallback(() => {
    setContextOptions([]);
  }, []);

  const contextValue = useMemo(() => {
    const gameOptions = [...globalOptions, ...contextOptions];
    return {
      gameOptions: gameOptions,
      addGameOptions: addGameOptions,
      setContextOptions,
      resetToGlobalOptions,
    };
  }, [
    globalOptions,
    contextOptions,
    addGameOptions,
    setContextOptions,
    resetToGlobalOptions,
  ]);

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
