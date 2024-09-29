import { isAxiosError } from 'axios';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-provider';
import api from '../services/authenticated-api';
import './dashboard-page.scss';

interface Game {
  _id: string;
  name: string;
  balance: number;
}

const DashboardPage: React.FC = () => {
  const [participatingGames, setParticipatingGames] = useState<Game[]>([]);
  const [createdGames, setCreatedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const fetchGames = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get('/game/list');
      setParticipatingGames(response.data.participatingGames);
      setCreatedGames(response.data.createdGames);
    } catch (error) {
      console.error('Error fetching games:', error);
      if (isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    (async () => {
      await fetchGames();
    })();
  }, [fetchGames, isAuthenticated, user]);

  if (isLoading) {
    return <div className="dashboard-container">Loading dashboard data...</div>;
  }

  const renderGameList = (games: Game[], title: string) => (
    <div className="game-list">
      <h2>{title}</h2>
      {games.length === 0 ? (
        <p>No games available.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game._id}>
              <Link to={`/game/${game._id}`}>{game.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">Your Dashboard</h1>
        {renderGameList(participatingGames, "Games You're Participating In")}
        {renderGameList(createdGames, "Games You've Created")}
        <Link to="/create-game" className="btn btn-primary create-game-button">
          Create New Game
        </Link>
      </div>
    </div>
  );
};

export default memo(DashboardPage);
