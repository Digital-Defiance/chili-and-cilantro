import { IRequestUser } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { isAxiosError } from 'axios';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './services/auth-service';

export interface AuthContextData {
  user: IRequestUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (
    identifier: string,
    password: string,
    isEmail: boolean,
  ) => Promise<{ token: string } | { error: string; status?: number }>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; message: string }>;
  verifyToken: (token: string) => Promise<void>;
  checkAuth: () => void;
  authState: number;
}

export type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IRequestUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState(0);
  const navigate = useNavigate();

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
      try {
        setLoading(true);
        const loginResult = await authService.login(
          identifier,
          password,
          isEmail,
        );
        // if loginResult is an object with an error, setError with it
        if (typeof loginResult === 'object' && 'error' in loginResult) {
          setError(loginResult.error);
        } else if (typeof loginResult === 'object' && 'token' in loginResult) {
          localStorage.setItem('authToken', loginResult.token);
          setAuthState((prev) => prev + 1);
        }
        return loginResult;
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
          setLoading(false);
          return { error: error.message };
        } else {
          setError('An unknown error occurred');
          setLoading(false);
          return { error: 'An unknown error occurred' };
        }
      }
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
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
    ): Promise<{ success: boolean; message: string }> => {
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

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      error,
      changePassword,
      login,
      logout,
      verifyToken,
      checkAuth,
      authState,
    }),
    [
      user,
      isAuthenticated,
      loading,
      error,
      changePassword,
      login,
      logout,
      verifyToken,
      checkAuth,
      authState,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
