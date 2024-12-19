import {
  CardType,
  IGameChefResponse,
  StringNames,
  TurnAction,
  ValidationError,
  constants,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  IApplication,
  RouteConfig,
  handleError,
  routeConfig,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { environment } from '../../environment';
import { ActionService } from '../../services/action';
import { ChefService } from '../../services/chef';
import { GameService } from '../../services/game';
import { PlayerService } from '../../services/player';
import { BaseController } from '../base';

export class GameController extends BaseController {
  private readonly actionService;
  private readonly chefService;
  private readonly playerService;
  private readonly gameService;

  constructor(application: IApplication) {
    super(application);
    this.actionService = new ActionService(
      application,
      environment.developer.useTransactions,
    );
    this.chefService = new ChefService(
      application,
      environment.developer.useTransactions,
    );
    this.playerService = new PlayerService(
      application,
      environment.developer.useTransactions,
    );
    this.gameService = new GameService(
      application,
      this.actionService,
      this.chefService,
      this.playerService,
      environment.developer.useTransactions,
    );
  }

  protected getRoutes(): RouteConfig<unknown[]>[] {
    return [
      routeConfig<unknown[]>({
        method: 'get',
        path: '/list',
        handler: this.getGames,
        useAuthentication: true,
      }),
      routeConfig<unknown[]>({
        method: 'post',
        path: '/create',
        handler: this.createGame,
        useAuthentication: true,
        validation: [
          body('name')
            .isString()
            .trim()
            .notEmpty()
            .matches(
              constants.GAME_NAME_REGEX,
              constants.GAME_NAME_REGEX_ERROR,
            ),
          body('username')
            .isString()
            .trim()
            .notEmpty()
            .matches(
              constants.USERNAME_REGEX,
              translate(StringNames.Validation_UsernameRegexErrorTemplate),
            ),
          body('displayname')
            .isString()
            .trim()
            .notEmpty()
            .matches(
              constants.USER_DISPLAY_NAME_REGEX,
              constants.USER_DISPLAY_NAME_REGEX_ERROR,
            ),
          body('password')
            .optional()
            .isString()
            .trim()
            .matches(
              constants.PASSWORD_REGEX,
              translate(StringNames.Validation_PasswordRegexErrorTemplate),
            ),
          body('maxChefs').isInt({ min: 2, max: 8 }),
        ],
      }),
      routeConfig<unknown[]>({
        method: 'post',
        path: '/:code/join',
        handler: this.joinGame,
        useAuthentication: true,
        validation: [
          body('username')
            .isString()
            .trim()
            .notEmpty()
            .matches(
              constants.USERNAME_REGEX,
              translate(StringNames.Validation_UsernameRegexErrorTemplate),
            ),
          body('password')
            .optional()
            .isString()
            .trim()
            .matches(
              constants.PASSWORD_REGEX,
              translate(StringNames.Validation_PasswordRegexErrorTemplate),
            ),
          body('displayname')
            .isString()
            .trim()
            .notEmpty()
            .matches(
              constants.USER_DISPLAY_NAME_REGEX,
              constants.USER_DISPLAY_NAME_REGEX_ERROR,
            ),
        ],
      }),
      routeConfig<unknown[]>({
        method: 'post',
        path: '/:code/message',
        handler: this.sendMessage,
        useAuthentication: true,
        validation: [body('message').isString().trim().notEmpty()],
      }),
      routeConfig<unknown[]>({
        method: 'get',
        path: '/:code/history',
        handler: this.getGameHistory,
        useAuthentication: true,
      }),
      routeConfig<unknown[]>({
        method: 'post',
        path: '/:code/start',
        handler: this.startGame,
        useAuthentication: true,
      }),
      routeConfig<unknown[]>({
        method: 'get',
        path: '/:code/action',
        handler: this.getAvailableActions,
        useAuthentication: true,
      }),
      routeConfig<unknown[]>({
        method: 'post',
        path: '/:code/action',
        handler: this.performTurnAction,
        useAuthentication: true,
        validation: [
          body('action').isString().isIn(Object.values(TurnAction)),
          body('cardType').optional().isString().isIn(Object.values(CardType)),
        ],
      }),
    ];
  }

  /**
   * Creates a new game.
   * @param req The request
   * @param res The response
   * @param next The next function
   * @returns
   */
  private async createGame(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const { name, username, password, maxChefs } = req.body;
      const sanitizedName = (name as string)?.trim();
      const sanitizedUserName = (username as string)?.trim();
      const sanitizedPassword = (password as string)?.trim();
      const sanitizedMaxChefs = parseInt(maxChefs, 10);

      const { game, chef } = await this.gameService.performCreateGameAsync(
        user,
        sanitizedUserName,
        sanitizedName,
        sanitizedPassword,
        sanitizedMaxChefs,
      );
      this.sendApiMessageResponse(
        201,
        {
          message: translate(StringNames.Game_CreateGameSuccess),
          game,
          chef,
        } as IGameChefResponse,
        res,
      );
    } catch (error) {
      handleError(error, res, next);
    }
  }

  /**
   * Joins a game
   * @param req The request
   * @param res The response
   * @param next The next function
   * @returns
   */
  private async joinGame(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const { username, password } = req.validatedBody;
      const gameCode = req.params.code;
      const sanitizedUserName = (username as string)?.trim();
      const sanitizedPassword = (password as string)?.trim();

      const { game, chef } = await this.gameService.performJoinGameAsync(
        gameCode,
        sanitizedPassword,
        user,
        sanitizedUserName,
      );
      this.sendApiMessageResponse(
        200,
        {
          message: translate(StringNames.Game_JoinGameSuccess),
          game,
          chef,
        } as IGameChefResponse,
        res,
      );
    } catch (error) {
      handleError(error, res, next);
    }
  }

  /**
   * Send a message to game chat
   * @param req The request
   * @param res The response
   * @param next The next function
   * @returns
   */
  private async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const { message } = req.body;
      const gameCode = req.params.code;
      const sanitizedMessage = (message as string)?.trim();
      const messageAction = await this.gameService.performSendMessageAsync(
        gameCode,
        user,
        sanitizedMessage,
      );
      res.status(200).json(messageAction);
    } catch (e) {
      handleError(e, res, next);
    }
  }

  /**
   * Gets the history of the game
   * @param req The request
   * @param res The response
   * @param next The next function
   * @returns
   */
  private async getGameHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const game = await this.gameService.getGameByCodeOrThrowAsync(
        gameCode,
        true,
      );
      const actions = await this.actionService.getGameHistoryAsync(game);
      res.status(200).json(actions);
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        this.sendApiErrorResponse(500, 'An error occurred', e, res);
      }
    }
  }

  /**
   * Starts a game
   * @param req The request
   * @param res The response
   * @param next The next function
   * @returns
   */
  private async startGame(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const { game, action } = await this.gameService.performStartGameAsync(
        gameCode,
        user._id,
      );
      res.status(200).json({ game, action });
    } catch (e) {
      handleError(e, res, next);
    }
  }

  /**
   * Gets the available actions for the current turn
   * @param req The request
   * @param res The response
   * @param next The next function
   * @returns
   */
  private async getAvailableActions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const game = await this.gameService.getGameByCodeOrThrowAsync(
        gameCode,
        true,
      );
      const chef = await this.chefService.getGameChefOrThrowAsync(game, user);
      const actions = this.gameService.availableTurnActions(game, chef);
      res.status(200).json(actions);
    } catch (e) {
      handleError(e, res, next);
    }
  }

  /**
   * Performs a turn action for the specified game
   * @param req The request
   * @param res The response
   * @param next The next function
   * @returns
   */
  private async performTurnAction(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const { action, ingredient, bid } = req.body;
      const actionArgs = {
        ...(ingredient ? { ingredient: ingredient as CardType } : {}),
        ...(bid ? { bid: bid as number } : {}),
      };
      const { game, chef } = await this.gameService.performTurnActionAsync(
        gameCode,
        user,
        action as TurnAction,
        actionArgs,
      );
      res.status(200).json({ game, chef });
    } catch (e) {
      handleError(e, res, next);
    }
  }

  /**
   * Gets all games created and participating for the current user
   * @param req The request
   * @param res The response
   * @param next The next function
   * @returns The response
   */
  private async getGames(req: Request, res: Response, next: NextFunction) {
    return this.withTransaction<void>(async (session) => {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameResponse = await this.gameService.getGamesAsync(user, session);
      res.status(200).json(gameResponse);
    });
  }
}
