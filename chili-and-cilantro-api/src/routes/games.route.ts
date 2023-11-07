import { Request, Response, Router } from 'express';
import { validateAccessToken } from '../middlewares/auth0';
import { GameService } from '../services/gameService';
import { JwtService } from '../services/jwtService';
import { FirstChef } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Database } from '../services/database';
import { ValidationError } from '../errors/validationError';
import { CardType } from 'chili-and-cilantro-lib/src/lib/enumerations/cardType';

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
      const { name, userName, password, maxChefs, firstChef } = req.body;
      const sanitizedName = (name as string)?.trim();
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim().toLowerCase();
      const sanitizedMaxChefs = parseInt(maxChefs, 10);
      const sanitizedFirstChef: FirstChef = firstChef as FirstChef;

      const database = new Database();
      const gameService = new GameService(database);
      const { game, chef } = await gameService.createGameAsync(user, sanitizedUserName, sanitizedName, sanitizedPassword, sanitizedMaxChefs, sanitizedFirstChef);
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
      const gameService = new GameService(database);
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
      const gameService = new GameService(database);
      const messageAction = await gameService.sendMessageAsync(gameCode, user._id, sanitizedMessage);
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

gamesRouter.get('/:code/actions', validateAccessToken,
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
      const gameService = new GameService(database);
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
      const { firstChefId } = req.body;
      const gameCode = req.params.code;
      const database = new Database();
      const gameService = new GameService(database);
      const { game, action } = await gameService.startGameAsync(gameCode, user._id, firstChefId);
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

gamesRouter.post('/:code/place', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const gameCode = req.params.code;
      const { ingredient } = req.body;
      const ingredientCard = ingredient as CardType;
      const database = new Database();
      const gameService = new GameService(database);
      const { game, chef } = await gameService.placeIngredientAsync(gameCode, user, ingredientCard);
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