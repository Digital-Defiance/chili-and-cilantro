import {
  IGameObject,
  StringNames,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
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
  useTheme,
} from '@mui/material';
import { isAxiosError } from 'axios';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-provider';
import { useAppTranslation } from '../i18n-provider';
import api from '../services/authenticated-api';

const DashboardPage: React.FC = () => {
  const [participatingGames, setParticipatingGames] = useState<IGameObject[]>(
    [],
  );
  const [createdGames, setCreatedGames] = useState<IGameObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useAppTranslation();
  const theme = useTheme();

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

  const renderGameList = (games: IGameObject[], title: string) => (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {games.length === 0 ? (
        <Typography>{t(StringNames.Dashboard_NoGames)}</Typography>
      ) : (
        <List>
          {games.map((game) => (
            <ListItem
              key={game._id}
              component={RouterLink}
              to={`/kitchen/${game.code}`}
              sx={{
                color: theme.palette.text.primary,
                cursor: 'pointer',
                borderRadius: theme.shape.borderRadius, // Use theme's borderRadius
                mb: 1,
                border: `1px solid ${theme.palette.divider}`, // Add a subtle border
                transition: theme.transitions.create(
                  ['background-color', 'transform'],
                  {
                    // Add smooth transitions
                    duration: theme.transitions.duration.short,
                  },
                ),
                '&:hover': {
                  transform: 'scale(1.02)', // Slightly enlarge on hover for a playful feel
                  boxShadow: theme.shadows[2], // Add a shadow on hover
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.hover, // Change background on hover
                },
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
          {t(StringNames.Dashboard_Title)}
        </Typography>
        {renderGameList(
          participatingGames,
          t(StringNames.Dashboard_GamesParticipating),
        )}
        {renderGameList(createdGames, t(StringNames.Dashboard_GamesCreated))}
        <Box display="flex" justifyContent="center" mt={2} gap={2}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/cook/create"
          >
            {t(StringNames.Game_CreateGame)}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={RouterLink}
            to="/cook/join"
          >
            {t(StringNames.Game_JoinGame)}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default memo(DashboardPage);
