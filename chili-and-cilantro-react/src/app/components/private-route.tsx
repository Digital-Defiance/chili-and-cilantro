import { StringNames } from '@chili-and-cilantro/chili-and-cilantro-lib';
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth-provider';
import { useAppTranslation } from '../i18n-provider';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  const { t } = useAppTranslation();

  if (loading) {
    return <div>{t(StringNames.Common_CheckingAuthentication)}</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
