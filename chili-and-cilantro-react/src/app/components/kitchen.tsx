import {
  GamePhase,
  IChefObject,
  IGameObject,
  IRequestUser,
  StringNames,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Typography } from '@mui/material';
import { isAxiosError } from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-provider';
import { IncludeOnMenu } from '../enumerations/include-on-menu';
import { useAppTranslation } from '../i18n-provider';
import { PusherProvider, usePusher } from '../pusher-context';
import api from '../services/authenticated-api';
import { useRegisterMenuOption } from '../use-register-menu';

export const Kitchen: FC = () => {
  const { user } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [game, setGame] = useState<IGameObject | null>(null);
  const [chefs, setChefs] = useState<IChefObject[] | null>(null);
  const location = useLocation();
  const { t } = useAppTranslation();
  const { pusher, error: pusherError } = usePusher();
  const navigate = useNavigate();

  const endGame = useCallback(
    async (
      gameCode: string,
      currentPhase: GamePhase,
      masterChefId: string,
      t: (key: StringNames, variables?: Record<string, string>) => string,
    ) => {
      try {
        if (!user) {
          throw new Error(t(StringNames.Error_NotLoggedIn));
        }
        if (currentPhase === GamePhase.GAME_OVER) {
          throw new Error(t(StringNames.Error_GameEnded));
        }
        if (masterChefId !== user.id) {
          throw new Error(t(StringNames.Error_MustBeMasterChef));
        }

        const result = await api.post(`/game/${gameCode}/end`);
        navigate('/dashboard');
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          setError(error.response.data.message);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(t(StringNames.Common_UnexpectedError));
        }
      }
    },
    [user, navigate],
  );

  useEffect(() => {
    if (pusherError) {
      setError(pusherError);
    }
  }, [pusherError]);

  const handleEndGame = useCallback(() => {
    if (game?.code && game?.currentPhase && game?.masterChefId) {
      // Check if game exists before calling endGame
      endGame(game.code, game.currentPhase, game.masterChefId, t);
    }
  }, [game?.code, game?.currentPhase, game?.masterChefId, endGame, t]);

  const filterFunction = (
    game: IGameObject | null,
    user: IRequestUser | null,
  ): boolean => true;
  // !!game?.masterChefId && !!user?.id && game?.masterChefId === user?.id;

  useRegisterMenuOption(
    {
      id: 'end-game',
      label: t(StringNames.Game_EndGame),
      action: handleEndGame,
      icon: <i className="fa-solid fa-door-closed" />,
      requiresAuth: true,
      routePattern: /^\/kitchen\/.*$/,
      includeOnMenus: [IncludeOnMenu.GameMenu, IncludeOnMenu.SideMenu],
      index: 10,
      filter: () => filterFunction(game, user),
    },
    [game, user],
  );

  const getMasterChef: () => IChefObject | null = () => {
    if (!game || !chefs) {
      return null;
    }
    const masterChefIndex = chefs.findIndex(
      (c: IChefObject) => c._id === game.masterChefId,
    );
    return chefs[masterChefIndex];
  };

  const getUserChef: () => IChefObject | null = () => {
    if (!game || !chefs || !user) {
      return null;
    }
    const userChefIndex = chefs.findIndex(
      (c: IChefObject) => c.userId === user.id,
    );
    return chefs[userChefIndex];
  };

  useEffect(() => {
    const getGame: (gameCode: string) => Promise<void> = async (
      gameCode: string,
    ) => {
      if (!user) {
        return;
      }
      try {
        const response = await api.get(`/game/${gameCode}`);
        if (
          response.status === 200 &&
          'game' in response.data &&
          'chefs' in response.data
        ) {
          console.log(response.data);
          setGameCode(gameCode);
          setGame(response.data.game);
          setChefs(response.data.chefs);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          setError(error.response.data.message);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    // Extract gameCode from location.pathname
    const pathParts = location.pathname.split('/');
    const gameCode = pathParts[pathParts.length - 1]; // Get the last part of the path

    if (gameCode) {
      getGame(gameCode);
    }
  }, [location, user]);

  if (!user || !game || !chefs) {
    return null;
  }

  return (
    <PusherProvider>
      <div>
        <h1>
          {t(StringNames.Common_Kitchen)}: {gameCode}
        </h1>
        <h2>
          {t(StringNames.Common_Game)}: {game.name}
        </h2>
        <h3>
          {t(StringNames.Common_MasterChef)}: {getMasterChef()?.name}
        </h3>
        <h4>
          {t(StringNames.Common_Chef)}: {getUserChef()?.name}
        </h4>
        {error && <Typography color="error">{error}</Typography>}
      </div>
    </PusherProvider>
  );
};

export default Kitchen;
