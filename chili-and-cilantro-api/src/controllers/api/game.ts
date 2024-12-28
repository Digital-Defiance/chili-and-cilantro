import {
  CardType,
  EndGameReason,
  GamePhase,
  IActionResponse,
  IActionsResponse,
  IApiErrorResponse,
  IApiMessageResponse,
  IChefDocument,
  IGameActionResponse,
  IGameChefResponse,
  IGameChefsResponse,
  IGameListResponse,
  IMessageActionDocument,
  ITurnActionsResponse,
  NotFoundError,
  NotInGameError,
  StringNames,
  TurnAction,
  constants,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  IApplication,
  RouteConfig,
  SendFunction,
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
  private readonly actionService: ActionService;
  private readonly chefService: ChefService;
  private readonly playerService: PlayerService;
  private readonly gameService: GameService;

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

  protected getRoutes(): RouteConfig<
    IApiMessageResponse,
    false,
    Array<unknown>
  >[] {
    return [
      routeConfig<IGameListResponse | IApiErrorResponse, false, Array<unknown>>(
        {
          method: 'get',
          path: '/list',
          handler: this.getGames,
          useAuthentication: true,
        },
      ),
      routeConfig<IGameChefResponse | IApiErrorResponse, false, Array<unknown>>(
        {
          method: 'post',
          path: '/create',
          handler: this.createGame,
          useAuthentication: true,
          validation: [
            body('name')
              .isString()
              .trim()
              .notEmpty()
              .matches(constants.GAME_NAME_REGEX)
              .withMessage(
                translate(StringNames.Validation_GameNameRegexErrorTemplate),
              ),
            body('displayname')
              .isString()
              .trim()
              .notEmpty()
              .matches(constants.USER_DISPLAY_NAME_REGEX)
              .withMessage(
                translate(StringNames.Validation_DisplayNameRegexErrorTemplate),
              ),
            body('password')
              .optional()
              .isString()
              .trim()
              .matches(constants.PASSWORD_REGEX)
              .withMessage(
                translate(StringNames.Validation_PasswordRegexErrorTemplate),
              ),
            body('maxChefs').isInt({
              min: constants.MIN_CHEFS,
              max: constants.MAX_CHEFS,
            }),
          ],
        },
      ),
      routeConfig<
        IGameChefsResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >({
        method: 'post',
        path: '/:code/join',
        handler: this.joinGame,
        useAuthentication: true,
        validation: [
          body('password')
            .optional()
            .isString()
            .trim()
            .matches(constants.PASSWORD_REGEX)
            .withMessage(
              translate(StringNames.Validation_PasswordRegexErrorTemplate),
            ),
          body('displayname')
            .isString()
            .trim()
            .notEmpty()
            .matches(constants.USER_DISPLAY_NAME_REGEX)
            .withMessage(
              translate(StringNames.Validation_DisplayNameRegexErrorTemplate),
            ),
        ],
      }),
      routeConfig<
        IActionResponse<IMessageActionDocument> | IApiErrorResponse,
        false,
        Array<unknown>
      >({
        method: 'post',
        path: '/:code/message',
        handler: this.sendMessage,
        useAuthentication: true,
        validation: [body('message').isString().trim().notEmpty()],
      }),
      routeConfig<IActionsResponse | IApiErrorResponse, false, Array<unknown>>({
        method: 'get',
        path: '/:code/history',
        handler: this.getGameHistory,
        useAuthentication: true,
      }),
      routeConfig<
        IGameActionResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >({
        method: 'post',
        path: '/:code/start',
        handler: this.startGame,
        useAuthentication: true,
      }),
      routeConfig<
        IGameActionResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >({
        method: 'post',
        path: '/:code/end',
        handler: this.endGame,
        useAuthentication: true,
        validation: [
          body('reason').isString().isIn(Object.values(EndGameReason)),
        ],
      }),
      routeConfig<
        ITurnActionsResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >({
        method: 'get',
        path: '/:code/action',
        handler: this.getAvailableActions,
        useAuthentication: true,
      }),
      routeConfig<
        IGameChefsResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >({
        method: 'get',
        path: '/:code',
        handler: this.getGame,
        useAuthentication: true,
      }),
      routeConfig<IGameChefResponse | IApiErrorResponse, false, Array<unknown>>(
        {
          method: 'post',
          path: '/:code/action',
          handler: this.performTurnAction,
          useAuthentication: true,
          validation: [
            body('action').isString().isIn(Object.values(TurnAction)),
            body('cardType')
              .optional()
              .isString()
              .isIn(Object.values(CardType)),
          ],
        },
      ),
    ];
  }

  /**
   * Creates a new game.
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private async createGame(
    req: Request,
    res: Response<IGameChefResponse>,
    send: SendFunction<IGameChefResponse | IApiErrorResponse>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const { name, displayname, password, maxChefs } = req.validatedBody;
      const sanitizedName = (name as string)?.trim();
      const sanitizedDisplayName = (displayname as string)
        ?.trim()
        .toLowerCase();
      const sanitizedPassword = (password as string)?.trim();
      const sanitizedMaxChefs = parseInt(maxChefs, 10);

      const { game, chef } = await this.gameService.performCreateGameAsync(
        user,
        sanitizedDisplayName,
        sanitizedName,
        sanitizedMaxChefs,
        sanitizedPassword,
      );
      send(
        201,
        {
          message: translate(StringNames.Game_CreateGameSuccess),
          game: GameService.gameToGameObject(game),
          chef: ChefService.chefToChefObject(chef),
        },
        res,
      );
    } catch (error) {
      handleError(error, res, send as SendFunction<IApiErrorResponse>, next);
    }
  }

  /**
   * Joins a game
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private async joinGame(
    req: Request,
    res: Response,
    send: SendFunction<IGameChefsResponse | IApiErrorResponse>,
    next: NextFunction,
  ) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const { displayname, password } = req.validatedBody;
      const gameCode = req.params.code;
      const sanitizedDisplayName = (displayname as string)?.trim();
      const sanitizedPassword = (password as string)?.trim();

      const { game, chefs } = await this.gameService.performJoinGameAsync(
        gameCode,
        sanitizedPassword,
        user,
        sanitizedDisplayName,
      );
      send(
        200,
        {
          message: translate(StringNames.Game_JoinGameSuccess),
          game: GameService.gameToGameObject(game),
          chefs: chefs.map((c) => ChefService.chefToChefObject(c)),
        },
        res,
      );
    } catch (error) {
      handleError(error, res, send as SendFunction<IApiErrorResponse>, next);
    }
  }

  /**
   * Send a message to game chat
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private async sendMessage(
    req: Request,
    res: Response,
    send: SendFunction<
      IActionResponse<IMessageActionDocument> | IApiErrorResponse
    >,
    next: NextFunction,
  ) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const { message } = req.validatedBody;
      const gameCode = req.params.code;
      const sanitizedMessage = (message as string)?.trim();
      const messageAction = await this.gameService.performSendMessageAsync(
        gameCode,
        user,
        sanitizedMessage,
      );
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          action: messageAction,
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  }

  /**
   * Gets the history of the game
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private async getGameHistory(
    req: Request,
    res: Response,
    send: SendFunction<IActionsResponse | IApiErrorResponse>,
    next: NextFunction,
  ) {
    try {
      await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const isParticipant = await this.gameService.verifyUserIsParticipantAsync(
        req.user.id,
        gameCode,
      );
      if (!isParticipant) {
        send(
          403,
          {
            message: translate(StringNames.Error_NotInGame),
            error: new NotInGameError(403),
          },
          res,
        );
        return;
      }
      const game = await this.gameService.getGameByCodeOrThrowAsync(
        gameCode,
        true,
      );
      if (
        game.currentPhase === GamePhase.GAME_OVER &&
        new Date().getTime() >
          game.dateEnded.getTime() +
            constants.MAX_GAME_HISTORY_AGE_IN_HOURS * 60 * 60 * 1000
      ) {
        send(
          404,
          {
            message: translate(StringNames.Error_NotFound),
            error: new NotFoundError(),
          },
          res,
        );
        return;
      }
      const actions = await this.actionService.getGameHistoryAsync(game);
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          actions: actions.map((a) => ActionService.actionToActionObject(a)),
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  }

  /**
   * Starts a game
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private async startGame(
    req: Request,
    res: Response,
    send: SendFunction<IGameActionResponse | IApiErrorResponse>,
    next: NextFunction,
  ) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const { game, action } = await this.gameService.performStartGameAsync(
        gameCode,
        user._id,
      );
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          action: ActionService.actionToActionObject(action),
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  }

  /**
   * Gets the available actions for the current turn
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private async getAvailableActions(
    req: Request,
    res: Response,
    send: SendFunction<ITurnActionsResponse | IApiErrorResponse>,
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
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          actions,
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  }

  /**
   * Performs a turn action for the specified game
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private async performTurnAction(
    req: Request,
    res: Response,
    send: SendFunction<IGameChefResponse | IApiErrorResponse>,
    next: NextFunction,
  ) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const { action, ingredient, bid } = req.validatedBody;
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
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          chef: ChefService.chefToChefObject(chef),
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  }

  /**
   * Gets all games created and participating for the current user
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns The response
   */
  private async getGames(
    req: Request,
    res: Response,
    send: SendFunction<IGameListResponse | IApiErrorResponse>,
    next: NextFunction,
  ) {
    try {
      return this.withTransaction<void>(async (session) => {
        const user = await this.validateAndFetchRequestUser(req, res, next);
        const gameResponse: IGameListResponse =
          await this.gameService.getGamesAsync(user, session, true);
        send(200, gameResponse, res);
      });
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  }

  /**
   * Gets a game by code, user must be a participant
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns The response
   */
  private async getGame(
    req: Request,
    res: Response,
    send: SendFunction<IGameChefsResponse | IApiErrorResponse>,
    next: NextFunction,
  ) {
    return this.withTransaction<void>(async (session) => {
      const gameCode = req.params.code;
      const isParticipant = await this.gameService.verifyUserIsParticipantAsync(
        req.user.id,
        gameCode,
      );
      if (!isParticipant) {
        send(
          403,
          {
            message: translate(StringNames.Error_NotInGame),
            error: new NotInGameError(403),
          },
          res,
        );
        return;
      }
      const game = await this.gameService.getGameByCodeOrThrowAsync(
        gameCode,
        true,
        session,
      );
      const chefs: IChefDocument[] =
        await this.chefService.getGameChefsByGameOrIdAsync(game);
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          chefs: chefs.map((c) => ChefService.chefToChefObject(c)),
        },
        res,
      );
    });
  }

  private async endGame(
    req: Request,
    res: Response,
    send: SendFunction<IGameActionResponse | IApiErrorResponse>,
    next: NextFunction,
  ) {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const reason = req.validatedBody.reason as EndGameReason;
      const { game, action } = await this.gameService.performEndGameAsync(
        gameCode,
        reason,
        user._id,
      );
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          action: ActionService.actionToActionObject(action),
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  }
}
