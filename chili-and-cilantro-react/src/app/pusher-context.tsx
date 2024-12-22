import {
  IPusherAppInfoResponse,
  StringNames,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { isAxiosError } from 'axios';
import Pusher, { UserAuthenticationOptions } from 'pusher-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { useAppTranslation } from './i18n-provider';
import api from './services/authenticated-api';

interface PusherContextType {
  pusher: Pusher | null;
  appId: string | null;
  isLoading: boolean;
  error: string | null;
}

const PusherContext = createContext<PusherContextType>({
  pusher: null,
  appId: null,
  isLoading: true,
  error: null,
});

export const usePusher = (): PusherContextType => {
  return useContext(PusherContext);
};

export const PusherProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appKey, setAppKey] = useState<string | null>(null);
  const [cluster, setCluster] = useState<string | null>(null);
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const { isAuthenticated } = useAuth();
  const { t } = useAppTranslation();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content');

    if (!csrfToken) {
      setError('CSRF token not found!');
      return;
    }

    const fetchAppId = async () => {
      try {
        const response = await api('/pusher/appInfo');
        if (
          response.status !== 200 ||
          !response.data.cluster ||
          !response.data.appKey
        ) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data as IPusherAppInfoResponse;
        setAppKey(data.appKey);
        setCluster(data.cluster);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          setError(error.message);
        } else {
          setError(t(StringNames.Common_UnexpectedError));
        }
      }
    };

    const initializePusher = () => {
      if (appKey && cluster) {
        const pusherInstance = new Pusher(appKey, {
          cluster: cluster,
          userAuthentication: {
            endpoint: '/api/pusher/auth',
            headers: { 'X-CSRF-Token': csrfToken },
          } as UserAuthenticationOptions,
        });
        setPusher(pusherInstance);
        setIsLoading(false);
      }
    };

    if (!appKey || !cluster) {
      fetchAppId().then(initializePusher);
    }
  }, [isAuthenticated, appKey, cluster, t]);

  return (
    <PusherContext.Provider value={{ pusher, appId: appKey, isLoading, error }}>
      {children}
    </PusherContext.Provider>
  );
};
