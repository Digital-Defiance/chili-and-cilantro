import { FC, useEffect } from 'react';
import { useAuth } from '../auth-provider';

export const Logout: FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return null;
};

export default Logout;
