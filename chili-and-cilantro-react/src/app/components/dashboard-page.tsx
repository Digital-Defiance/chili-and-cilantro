import {
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { isAxiosError } from 'axios';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-provider';
import api from '../services/authenticated-api';

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
      console.log(response.data);
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
    fetchGames();
  }, [fetchGames]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const renderGameList = (games: Game[], title: string) => (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {games.length === 0 ? (
        <Typography>No games available.</Typography>
      ) : (
        <List>
          {games.map((game) => (
            <ListItem
              key={game._id}
              component={RouterLink}
              to={`/game/${game._id}`}
              sx={{
                '&:hover': { backgroundColor: 'action.hover' },
                cursor: 'pointer',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText primary={game.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Your Dashboard
        </Typography>
        {renderGameList(participatingGames, "Games You're Participating In")}
        {renderGameList(createdGames, "Games You've Created")}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/create-game"
          >
            Create New Game
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default memo(DashboardPage);
