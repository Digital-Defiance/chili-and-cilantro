import { Request, Response, Router } from 'express';
import { validateAccessToken } from '../middlewares/auth0';
import { GameService } from '../services/game';
import { JwtService } from '../services/jwt';
import { FirstChef, TurnAction } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Database } from '../services/database';
import { ValidationError } from '../errors/validationError';
import { CardType } from 'chili-and-cilantro-lib/src/lib/enumerations/cardType';
import { ActionService } from '../services/action';
import { ChefService } from '../services/chef';
import { PlayerService } from '../services/player';

export const gamesRouter = Router();

gamesRouter.post('/create', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const { name, userName, password, maxChefs } = req.body;
      const sanitizedName = (name as string)?.trim();
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim().toLowerCase();
      const sanitizedMaxChefs = parseInt(maxChefs, 10);

      const database = new Database();
      const actionService = new ActionService(database);
      const chefService = new ChefService(database);
      const playerService = new PlayerService(database);
      const gameService = new GameService(database, actionService, chefService, playerService);
      const { game, chef } = await gameService.createGameAsync(user, sanitizedUserName, sanitizedName, sanitizedPassword, sanitizedMaxChefs);
      res.send({ game, chef });
    }
    catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  });

gamesRouter.post('/:code/join', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const { userName, password } = req.body;
      const gameCode = req.params.code;
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim().toLowerCase();

      const database = new Database();
      const actionService = new ActionService(database);
      const chefService = new ChefService(database);
      const playerService = new PlayerService(database);
      const gameService = new GameService(database, actionService, chefService, playerService);
      const { game, chef } = await gameService.joinGameAsync(gameCode, sanitizedPassword, user, sanitizedUserName);
      res.send({ game, chef });
    }
    catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  });

gamesRouter.post('/:code/message', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const { message } = req.body;
      const gameCode = req.params.code;
      const sanitizedMessage = (message as string)?.trim();
      const database = new Database();
      const actionService = new ActionService(database);
      const chefService = new ChefService(database);
      const playerService = new PlayerService(database);
      const gameService = new GameService(database, actionService, chefService, playerService);
      const messageAction = await gameService.sendMessageAsync(gameCode, user, sanitizedMessage);
      res.status(200).json(messageAction);
    }
    catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  });

gamesRouter.get('/:code/history', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const gameCode = req.params.code;
      const database = new Database();
      const actionService = new ActionService(database);
      const chefService = new ChefService(database);
      const playerService = new PlayerService(database);
      const gameService = new GameService(database, actionService, chefService, playerService);
      const actions = await gameService.getGameActionsAsync(gameCode);
      res.status(200).json(actions);
    }
    catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  });

gamesRouter.post('/:code/start', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const gameCode = req.params.code;
      const database = new Database();
      const actionService = new ActionService(database);
      const chefService = new ChefService(database);
      const playerService = new PlayerService(database);
      const gameService = new GameService(database, actionService, chefService, playerService);
      const { game, action } = await gameService.startGameAsync(gameCode, user._id);
      res.status(200).json({ game, action });
    }
    catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  });

/**
 * Gets the available actions for the specified game and current user
 */
gamesRouter.get('/:code/action', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const gameCode = req.params.code;
      const database = new Database();
      const actionService = new ActionService(database);
      const chefService = new ChefService(database);
      const playerService = new PlayerService(database);
      const gameService = new GameService(database, actionService, chefService, playerService);
      const game = await gameService.getGameByCodeAsync(gameCode, true);
      const chef = await chefService.getChefAsync(game, user);
      const actions = await gameService.availableTurnActions(game, chef);
      res.status(200).json(actions);
    }
    catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  });

/**
 * Performs a turn action for the specified game
 */
gamesRouter.post('/:code/action', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const gameCode = req.params.code;
      const { action, ingredient, bid } = req.body;
      const actionArgs = { ...ingredient ? { ingredient: ingredient as CardType } : {}, ...bid ? { bid: bid as number } : {} };
      const database = new Database();
      const actionService = new ActionService(database);
      const chefService = new ChefService(database);
      const playerService = new PlayerService(database);
      const gameService = new GameService(database, actionService, chefService, playerService);
      const { game, chef } = await gameService.performTurnActionAsync(gameCode, user, action as TurnAction, actionArgs);
      res.status(200).json({ game, chef });
    }
    catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  });