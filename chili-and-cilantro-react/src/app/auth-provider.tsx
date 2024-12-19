import {
  GlobalLanguageContext,
  IRequestUser,
  ISuccessMessage,
  LanguageCodes,
  StringLanguages,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { isAxiosError } from 'axios';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from './i18n';
import authService from './services/auth-service';
import api from './services/authenticated-api';

export interface AuthContextData {
  user: IRequestUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  errorType: string | null;
  login: (
    identifier: string,
    password: string,
    isEmail: boolean,
  ) => Promise<{ token: string } | { error: string; status?: number }>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<ISuccessMessage>;
  verifyToken: (token: string) => Promise<void>;
  checkAuth: () => void;
  authState: number;
  language: StringLanguages;
  setUser: (user: IRequestUser | null) => void;
  setLanguage: (lang: StringLanguages) => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

export type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IRequestUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [authState, setAuthState] = useState(0);
  const navigate = useNavigate();

  const [language, setLanguage] = useState<StringLanguages>(() => {
    return (
      (localStorage.getItem('language') as StringLanguages) ??
      StringLanguages.EnglishUS
    );
  });

  useEffect(() => {
    if (user && user.siteLanguage) {
      setLanguage(user.siteLanguage);
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      await i18n.changeLanguage(LanguageCodes[language]);
      localStorage.setItem('language', language);
    })();
  }, [language]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const userData: IRequestUser = await authService.verifyToken(token);
      setUser(userData);
      setIsAuthenticated(true);
      setToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      (async () => {
        await checkAuth();
      })();
    } else {
      setLoading(false);
    }
  }, [checkAuth, authState]);

  const login = useCallback(
    async (
      identifier: string,
      password: string,
      isEmail: boolean,
    ): Promise<{ token: string } | { error: string; status?: number }> => {
      setLoading(true);
      const loginResult = await authService.login(
        identifier,
        password,
        isEmail,
      );
      setLoading(false);
      // if loginResult is an object with an error, setError with it
      if (typeof loginResult === 'object' && 'error' in loginResult) {
        setError(loginResult.error);
        if ('errorType' in loginResult && loginResult.errorType) {
          setErrorType(loginResult.errorType ?? null);
        }
      } else if (typeof loginResult === 'object' && 'token' in loginResult) {
        localStorage.setItem('authToken', loginResult.token);
        setAuthState((prev) => prev + 1);
        setToken(loginResult.token);
        setError(null);
        setErrorType(null);
      }
      return loginResult;
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
    setAuthState((prev) => prev + 1);
    navigate('/');
  }, [navigate]);

  const verifyToken = useCallback(async (token: string) => {
    try {
      await authService.verifyToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      setError('Invalid token');
    }
  }, []);

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
    ): Promise<ISuccessMessage> => {
      try {
        await authService.changePassword(currentPassword, newPassword);
        // Handle success (e.g., show a message)
        return { success: true, message: 'Password changed successfully' };
      } catch (error) {
        // Handle error (e.g., set error state)
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
              'An error occurred while changing the password',
          );
        } else if (error instanceof Error) {
          throw error;
        } else {
          throw new Error(
            'An unexpected error occurred while changing the password',
          );
        }
      }
    },
    [],
  );

  const contextValue = useMemo(() => {
    const setUserAndLanguage = (newUser: IRequestUser | null) => {
      setUser(newUser);
      if (newUser && newUser.siteLanguage) {
        setLanguage(newUser.siteLanguage);
      }
      setIsAuthenticated(!!newUser);
    };

    const setLanguageAndUpdateUser = (newLanguage: StringLanguages) => {
      setLanguage(newLanguage);
      GlobalLanguageContext.language = newLanguage;
      if (user) {
        try {
          // Make API call to update user language
          api.post('/user/language', { language: newLanguage }).then(() => {
            console.log('User language updated');
          });
          setUser({ ...user, siteLanguage: newLanguage });
        } catch (error) {
          console.error('Failed to update user language:', error);
        }
      }
    };

    return {
      user,
      isAuthenticated,
      loading,
      error,
      errorType,
      changePassword,
      login,
      logout,
      verifyToken,
      checkAuth,
      authState,
      setUser: setUserAndLanguage,
      language,
      setLanguage: setLanguageAndUpdateUser,
      token,
      setToken,
    };
  }, [
    user,
    isAuthenticated,
    loading,
    error,
    errorType,
    changePassword,
    login,
    logout,
    verifyToken,
    checkAuth,
    authState,
    language,
    token,
    setToken,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
