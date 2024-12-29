import {
  EndGameReason,
  GamePhase,
  IActionObject,
  IChefObject,
  IGameChefsHistoryResponse,
  IGameObject,
  StringNames,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { isAxiosError } from 'axios';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-provider';
import { IncludeOnMenu } from '../enumerations/include-on-menu';
import { useAppTranslation } from '../i18n-provider';
import { IMenuOption } from '../interfaces/menu-option';
import { PusherProvider, usePusher } from '../pusher-context';
import api from '../services/authenticated-api';
import { useRegisterMenuOption } from '../use-register-menu';
import ShareGame from './share-game';

export const Kitchen: FC = () => {
  const { user } = useAuth();

  const [openEndGameDialog, setOpenEndGameDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [game, setGame] = useState<IGameObject | null>(null);
  const [chefs, setChefs] = useState<IChefObject[] | null>(null);
  const [history, setHistory] = useState<IActionObject[] | null>(null);
  const location = useLocation();
  const { t } = useAppTranslation();
  const { pusher, error: pusherError } = usePusher();
  const navigate = useNavigate();

  const endGame = useCallback(
    async (
      gameCode: string,
      currentPhase: GamePhase,
      masterChefUserId: string,
      t: (key: StringNames, variables?: Record<string, string>) => string,
    ) => {
      try {
        if (!user) {
          throw new Error(t(StringNames.Error_NotLoggedIn));
        }
        if (currentPhase === GamePhase.GAME_OVER) {
          throw new Error(t(StringNames.Error_GameEnded));
        }
        if (masterChefUserId !== user.id) {
          throw new Error(t(StringNames.Error_MustBeMasterChef));
        }

        const result = await api.post(`/game/${gameCode}/end`, {
          reason: EndGameReason.ENDED_BY_HOST,
        });
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

  const handleOpenEndGameDialog = useCallback(() => {
    setOpenEndGameDialog(true);
  }, []);

  const handleCloseEndGameDialog = useCallback(() => {
    setOpenEndGameDialog(false);
  }, []);

  const handleConfirmEndGame = useCallback(() => {
    // Perform end game action here, e.g., call endGame()
    if (game?.code && game?.currentPhase && game?.masterChefUserId) {
      endGame(game.code, game.currentPhase, game.masterChefUserId, t);
    }

    setOpenEndGameDialog(false);
  }, [game, endGame, t]);

  useEffect(() => {
    if (pusherError) {
      setError(pusherError);
    }
  }, [pusherError]);

  const filterFunction = useCallback(
    (option: IMenuOption) => {
      const result =
        game !== null &&
        user !== null &&
        user.id !== null &&
        game.masterChefUserId === user.id;
      return result;
    },
    [game, user],
  );

  useRegisterMenuOption(
    useMemo(
      () => ({
        id: 'end-game',
        label: t(StringNames.Game_EndGame),
        action: handleOpenEndGameDialog,
        icon: <i className="fa-solid fa-door-closed" />,
        requiresAuth: true,
        routePattern: /^\/kitchen\/.*$/,
        includeOnMenus: [IncludeOnMenu.GameMenu, IncludeOnMenu.SideMenu],
        index: 10,
        filter: filterFunction,
      }),
      [t, handleOpenEndGameDialog, filterFunction],
    ),
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
          'chefs' in response.data &&
          'history' in response.data
        ) {
          const data = response.data as IGameChefsHistoryResponse;
          setGameCode(gameCode);
          setGame(data.game);
          setChefs(data.chefs);
          setHistory(data.history);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setGameCode(null);
        setGame(null);
        setChefs(null);
        setHistory(null);
        if (
          isAxiosError(error) &&
          error.response &&
          error.response.data.message
        ) {
          setError(error.response.data.message);
        } else {
          setError(t(StringNames.Common_UnexpectedError));
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
      <Box>
        <Box display="flex" justifyContent="space-between">
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
        </Box>
        <Box display="flex" justifyContent="space-between">
          <ShareGame game={game} />
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <Dialog
          open={openEndGameDialog}
          onClose={handleCloseEndGameDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t(StringNames.Game_EndGame)}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t(StringNames.Game_EndGameConfirmation)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEndGameDialog} color="primary">
              {t(StringNames.Common_Cancel)}
            </Button>
            <Button onClick={handleConfirmEndGame} color="primary" autoFocus>
              {t(StringNames.Common_Confirm)}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PusherProvider>
  );
};

export default Kitchen;
