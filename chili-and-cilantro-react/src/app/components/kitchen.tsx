import {
  IChefObject,
  IGameObject,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { isAxiosError } from 'axios';
import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth-provider';
import { PusherProvider } from '../pusher-context';
import api from '../services/authenticated-api';

export const Kitchen: FC = () => {
  const { user } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [game, setGame] = useState<IGameObject | null>(null);
  const [chefs, setChefs] = useState<IChefObject[] | null>(null);
  const location = useLocation();

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
        <h1>Kitchen: {gameCode}</h1>
        <h2>Game: {game.name}</h2>
        <h3>Host Chef: {getMasterChef()?.name}</h3>
        <h4>Chef: {getUserChef()?.name}</h4>
        {error && <p>{error}</p>}
      </div>
    </PusherProvider>
  );
};

export default Kitchen;
