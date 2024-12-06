// src/app/components/i18n-provider.tsx

import {
  StringNames,
  stringNameToI18nKey,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { createContext, FC, ReactNode, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationProviderProps {
  children: ReactNode;
}

interface TranslationContextType {
  t: (key: StringNames) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,
);

export const TranslationProvider: FC<TranslationProviderProps> = ({
  children,
}) => {
  const { t } = useTranslation();

  const translationFunction = useCallback(
    (key: StringNames) => {
      return t(stringNameToI18nKey(key));
    },
    [t],
  );

  const value = {
    t: translationFunction,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useAppTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      'useAppTranslation must be used within a TranslationProvider',
    );
  }
  return context;
};
