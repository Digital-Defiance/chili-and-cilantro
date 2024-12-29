import {
  AllCardsPlacedError,
  CardType,
  ChefAlreadyJoinedError,
  ChefState,
  DefaultIdType,
  EndGameReason,
  GameEndedError,
  GameInProgressError,
  GamePasswordMismatchError,
  GamePhase,
  IActionDocument,
  IBid,
  IChefDocument,
  ICreateGameActionDocument,
  IEndGameActionDocument,
  IGameAction,
  IGameChef,
  IGameChefsHistory,
  IGameDocument,
  IGameListResponse,
  IGameObject,
  IMessageActionDocument,
  IUserDocument,
  IncorrectGamePhaseError,
  InvalidActionError,
  InvalidEndGameReasonError,
  InvalidGameError,
  InvalidGameNameError,
  InvalidGamePasswordError,
  InvalidMessageError,
  InvalidUserDisplayNameError,
  ModelName,
  MustBeMasterChefError,
  NotEnoughChefsError,
  NotYourTurnError,
  OutOfIngredientError,
  StringNames,
  TooManyChefsError,
  TurnAction,
  UsernameInUseError,
  constants,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { ClientSession, Document, Types } from 'mongoose';
import validator from 'validator';
import { IBidIngredient } from '../interfaces/bid-ingredient';
import { ActionService } from './action';
import { BaseService } from './base';
import { ChefService } from './chef';
import { PlayerService } from './player';
import { UtilityService } from './utility';

export class GameService extends BaseService {
  private readonly actionService: ActionService;
  private readonly chefService: ChefService;
  private readonly playerService: PlayerService;

  constructor(
    application: IApplication,
    actionService: ActionService,
    chefService: ChefService,
    playerService: PlayerService,
    useTransactions = true,
  ) {
    super(application, useTransactions);
    this.actionService = actionService;
    this.chefService = chefService;
    this.playerService = playerService;
  }

  /**
   * Converts a game document to a game object
   * @param game The game document to convert
   * @returns The game object
   */
  public static gameToGameObject(
    game: IGameDocument | Record<string, any>,
  ): IGameObject {
    const gameObject = game instanceof Document ? game.toObject() : game;
    const roundWinners: Record<number, string> = {};
    for (const key in gameObject.roundWinners) {
      roundWinners[key] = game.roundWinners[key].toString();
    }
    const roundBids: Record<number, IBid<string>[]> = {};
    for (const key in gameObject.roundBids) {
      if (key.startsWith('$')) {
        continue;
      }
      roundBids[key] = game.roundBids[key].map((bid) => {
        return {
          ...bid,
          chefId: bid.chefId.toString(),
        } as IBid<string>;
      });
    }

    return {
      ...gameObject,
      _id: game._id.toString(),
      chefIds: game.chefIds.map((id: DefaultIdType) => id.toString()),
      eliminatedChefIds: game.eliminatedChefIds.map((id: DefaultIdType) =>
        id.toString(),
      ),
      turnOrder: game.turnOrder.map((id: DefaultIdType) => id.toString()),
      roundWinners: roundWinners,
      roundBids: roundBids,
      lastGame: game.lastGame?.toString(),
      winner: game.winner?.toString(),
      masterChefId: game.masterChefId.toString(),
      masterChefUserId: game.masterChefUserId.toString(),
      createdBy: game.createdBy.toString(),
      updatedBy: game.updatedBy.toString(),
    } as IGameObject;
  }

  /**
   * Gets games for the specified user
   * @returns created and participating games
   */
  public async getGamesAsync(
    userDoc: IUserDocument,
    session?: ClientSession,
    active?: boolean,
  ): Promise<IGameListResponse> {
    const GameModel = this.application.getModel<IGameDocument>(ModelName.Game);
    const createdGames: IGameObject[] = (
      await GameModel.find({
        masterChefUserId: userDoc._id,
        ...(active ? { currentPhase: { $ne: GamePhase.GAME_OVER } } : {}),
      })
        .session(session)
        .lean()
        .exec()
    ).map(GameService.gameToGameObject);
    const chefIds = await this.chefService.getChefsByUserIdAsync(
      userDoc._id,
      session,
    );
    const participatingGames: IGameObject[] = (
      await GameModel.find({
        chefIds: { $in: chefIds },
        ...(active ? { currentPhase: { $ne: GamePhase.GAME_OVER } } : {}),
      })
        .session(session)
        .lean()
        .exec()
    ).map(GameService.gameToGameObject);

    return {
      message: translate(StringNames.Common_Success),
      participatingGames,
      createdGames,
    };
  }

  /**
   * Generates a new game code that is not being used by an active game
   * Should be called within a transaction
   * @returns string game code
   */
  public async generateNewGameCodeAsync(): Promise<string> {
    const GameModel = this.application.getModel<IGameDocument>(ModelName.Game);
    // find a game code that is not being used by an active game
    // codes are freed up when currentPhase is GAME_OVER
    let code = '';
    let gameCount = 0;
    const totalAttempts = 1000;
    let attemptsRemaining = totalAttempts;
    while (attemptsRemaining-- > 0) {
      code = UtilityService.generateGameCode();
      // check if there is an active game with the given game code
      gameCount = await GameModel.countDocuments({
        code,
        currentPhase: { $ne: GamePhase.GAME_OVER },
      });
      if (gameCount === 0) {
        // If no active game has the code, it can be used for a new game
        return code;
      }
    }
    throw new Error(
      `Unable to generate a unique game code in ${totalAttempts} attempts.`,
    );
  }

  /**
   * Validates the parameters before creating a game or throws a validation error
   * @param user The user creating the game
   * @param displayName The display name for the user
   * @param gameName The name of the game
   * @param password Optional password for the game. Empty string for no password.
   * @param maxChefs The maximum number of chefs in the game. Must be between MIN_CHEFS and MAX_CHEFS.
   */
  public async validateCreateGameOrThrowAsync(
    user: IUserDocument,
    displayName: string,
    gameName: string,
    maxChefs: number,
    password?: string,
  ): Promise<void> {
    if (await this.playerService.userIsInAnyActiveGameAsync(user)) {
      throw new ChefAlreadyJoinedError();
    }
    if (
      !validator.matches(displayName, constants.USER_DISPLAY_NAME_REGEX) ||
      displayName.length < constants.MIN_USER_DISPLAY_NAME_LENGTH ||
      displayName.length > constants.MAX_USER_DISPLAY_NAME_LENGTH
    ) {
      throw new InvalidUserDisplayNameError(displayName);
    }
    if (
      !validator.matches(gameName, constants.GAME_NAME_REGEX) ||
      gameName.length < constants.MIN_GAME_NAME_LENGTH ||
      gameName.length > constants.MAX_GAME_NAME_LENGTH
    ) {
      throw new InvalidGameNameError();
    }
    if (
      password !== undefined &&
      (!validator.matches(password, constants.GAME_PASSWORD_REGEX) ||
        password.length < constants.MIN_GAME_PASSWORD_LENGTH ||
        password.length > constants.MAX_GAME_PASSWORD_LENGTH)
    ) {
      throw new InvalidGamePasswordError();
    }
    if (maxChefs < constants.MIN_CHEFS) {
      throw new NotEnoughChefsError(maxChefs);
    }
    if (maxChefs > constants.MAX_CHEFS) {
      throw new TooManyChefsError();
    }
  }

  /**
   * Creates a new game with the specified parameters
   * @param user The user creating the game
   * @param displayName The display name for the user
   * @param gameName The name of the game
   * @param password Optional password for the game. Empty string for no password.
   * @param maxChefs The maximum number of chefs in the game. Must be between MIN_CHEFS and MAX_CHEFS.
   * @param gameId The id of the game
   * @param masterChefId The id of the master chef
   * @returns
   */
  public async createGameAsync(
    user: IUserDocument,
    displayName: string,
    gameName: string,
    maxChefs: number,
    password?: string,
    gameId: DefaultIdType = new Types.ObjectId(),
    masterChefId: DefaultIdType = new Types.ObjectId(),
  ): Promise<{
    game: IGameDocument;
    chef: IChefDocument;
    action: ICreateGameActionDocument;
  }> {
    const GameModel = this.application.getModel<IGameDocument>(ModelName.Game);
    const gameCode = await this.generateNewGameCodeAsync();
    const games = await GameModel.create([
      {
        _id: gameId,
        cardsPlaced: 0,
        chefIds: [masterChefId],
        code: gameCode,
        currentBid: constants.NONE,
        currentChef: constants.NONE,
        currentPhase: GamePhase.LOBBY,
        currentRound: constants.NONE,
        masterChefId: masterChefId,
        masterChefUserId: user._id,
        maxChefs: maxChefs,
        name: gameName,
        ...(password ? { password: password } : {}),
        roundBids: [],
        roundWinners: {},
        turnOrder: [], // will be chosen when the game is started
        createdBy: user._id,
        updatedBy: user._id,
      },
    ]);
    if (games.length !== 1) {
      throw new Error('Failed to create game');
    }
    const game = games[0];
    const chef = await this.chefService.newChefAsync(
      game,
      user,
      displayName,
      true,
      masterChefId,
    );
    const action = await this.actionService.createGameAsync(game, chef, user);
    return { game, chef, action };
  }

  /**
   * Creates a new game with the specified parameters
   * @param user The user creating the game
   * @param displayName The display name for the user
   * @param gameName The name of the game
   * @param password Optional password for the game. Empty string for no password.
   * @param maxChefs The maximum number of chefs in the game. Must be between MIN_CHEFS and MAX_CHEFS.
   * @param session The session to use for the transaction
   * @returns
   */
  public async performCreateGameAsync(
    user: IUserDocument,
    displayName: string,
    gameName: string,
    maxChefs: number,
    password?: string,
    session?: ClientSession,
  ): Promise<IGameChef> {
    return await this.withTransaction<IGameChef>(async () => {
      await this.validateCreateGameOrThrowAsync(
        user,
        displayName,
        gameName,
        maxChefs,
        password,
      );
      return await this.createGameAsync(
        user,
        displayName,
        gameName,
        maxChefs,
        password,
      );
    }, session);
  }

  /**
   * Joins the player to the specified game and creates a chef object for them
   * A password is not needed as it is validated earlier.
   * @param game The game to join
   * @param user The user joining
   * @param displayName The display name for the user
   * @returns A tuple of the game and chef objects
   */
  public async joinGameAsync(
    game: IGameDocument,
    user: IUserDocument,
    displayName: string,
    session?: ClientSession,
  ): Promise<IGameChefsHistory> {
    if (game.currentPhase === GamePhase.GAME_OVER) {
      throw new GameEndedError();
    } else if (game.currentPhase !== GamePhase.LOBBY) {
      throw new GameInProgressError();
    }
    const history = await this.getGameHistoryAsync(game._id, session);
    // if the user is already in the game, just return the game and chef
    // get chefIds for this user and game
    const chefs = await this.chefService.getGameChefsByGameOrIdAsync(game);
    if (chefs.some((c) => c.userId.toString() === user._id.toString())) {
      return { game, chefs, history };
    }
    const chef = await this.chefService.newChefAsync(
      game,
      user,
      displayName,
      false,
      undefined,
      session,
    );
    const joinGameAction = await this.actionService.joinGameAsync(
      game,
      chef,
      user,
      session,
    );
    game.chefIds.push(chef._id);
    const savedGame = await game.save();
    chefs.push(chef);
    history.push(joinGameAction);
    return { game: savedGame, chefs, history };
  }

  public async validateJoinGameOrThrowAsync(
    game: IGameDocument,
    user: IUserDocument,
    userDisplayName: string,
    password: string,
  ): Promise<void> {
    const isParticipant = await this.verifyUserIsParticipantAsync(
      user._id.toString(),
      game.code,
    );
    if (isParticipant) {
      // if already joined, do nothing
      return;
    }
    if (await this.playerService.userIsInAnyActiveGameAsync(user)) {
      throw new ChefAlreadyJoinedError();
    }
    const chefNames = await this.getGameChefNamesByGameIdAsync(
      game._id.toString(),
    );
    if (chefNames.includes(userDisplayName)) {
      throw new UsernameInUseError();
    }
    if (
      (game.password && game.password !== password) ||
      (password && !game.password)
    ) {
      throw new GamePasswordMismatchError();
    }
    if (game.currentPhase !== GamePhase.LOBBY) {
      throw new GameInProgressError();
    }
    if (game.chefIds.length > game.maxChefs) {
      throw new TooManyChefsError();
    }
    if (
      !validator.matches(userDisplayName, constants.USER_DISPLAY_NAME_REGEX) ||
      userDisplayName.length < constants.MIN_USER_DISPLAY_NAME_LENGTH ||
      userDisplayName.length > constants.MAX_USER_DISPLAY_NAME_LENGTH
    ) {
      throw new InvalidUserDisplayNameError(userDisplayName);
    }
  }

  /**
   * Joins the player to the specified game and creates a chef object for them
   * @param gameCode
   * @param password
   * @param user
   * @param displayName
   * @param session The session to use for the transaction
   * @returns
   */
  public async performJoinGameAsync(
    gameCode: string,
    password: string,
    user: IUserDocument,
    displayName: string,
    session?: ClientSession,
  ): Promise<IGameChefsHistory> {
    return await this.withTransaction<IGameChefsHistory>(async () => {
      const game = await this.getGameByCodeOrThrowAsync(
        gameCode,
        true,
        session,
      );
      await this.validateJoinGameOrThrowAsync(
        game,
        user,
        displayName,
        password,
      );
      return await this.joinGameAsync(game, user, displayName, session);
    }, session);
  }

  public async createNewGameFromExistingAsync(
    existingGame: IGameDocument,
    user: IUserDocument,
    session?: ClientSession,
  ): Promise<IGameChef> {
    return await this.withTransaction<IGameChef>(async (session) => {
      const GameModel = this.application.getModel<IGameDocument>(
        ModelName.Game,
      );
      const newChefIds = existingGame.chefIds.map(() => new Types.ObjectId());

      // find the existing chef id's index
      const masterChefIndex = existingGame.chefIds.findIndex(
        (chefId) => existingGame.masterChefId.toString() == chefId.toString(),
      );
      const newMasterChefId = newChefIds[masterChefIndex];

      // we need to look up the user id for all chefs in the current game
      const existingChefs = await this.chefService.getGameChefsByGameOrIdAsync(
        existingGame,
        session,
      );

      // Create the new Game document without persisting to the database yet
      const newGameId = new Types.ObjectId();
      const newGames = await GameModel.create(
        [
          {
            _id: newGameId,
            chefIds: newChefIds,
            code: existingGame.code,
            cardsPlaced: 0,
            currentBid: constants.NONE,
            currentChef: constants.NONE,
            currentRound: constants.NONE,
            currentPhase: GamePhase.LOBBY,
            masterChefId: newChefIds[masterChefIndex],
            masterChefUserId: existingGame.masterChefUserId,
            lastGame: existingGame._id,
            maxChefs: existingGame.maxChefs,
            name: existingGame.name,
            ...(existingGame.password
              ? { password: existingGame.password }
              : {}),
            roundBids: [],
            roundWinners: {},
            turnOrder: [], // will be chosen when the game is started
          },
        ],
        { session },
      );
      if (newGames.length !== 1) {
        throw new Error('Failed to create game');
      }
      const newGame = newGames[0];

      // Create new Chef documents
      const chefCreations = await Promise.all(
        newChefIds.map(async (newChefId, index) => {
          const existingChef = await existingChefs.find(
            (chef) =>
              chef._id.toString() == existingGame.chefIds[index].toString(),
          );
          return await this.chefService.newChefFromExistingAsync(
            newGame,
            existingChef,
            newChefId,
          );
        }),
      );

      // Execute all creations concurrently
      const chefs = await Promise.all(chefCreations);

      // Create action for game creation - this could be moved to an event or a method to encapsulate the logic
      const masterChef = chefs.find(
        (chef) => chef._id.toString() == newMasterChefId.toString(),
      );
      await this.actionService.createGameAsync(newGame, masterChef, user);
      return { game: newGame, chef: chefs[masterChefIndex] };
    }, session);
  }

  /**
   * Validates that a new game can be created from an existing game or throws a validation error
   * @param existingGame The existing game to create a new game from
   */
  public validateCreateNewGameFromExistingOrThrow(
    existingGame: IGameDocument,
  ): void {
    if (existingGame.currentPhase !== GamePhase.GAME_OVER) {
      throw new GameInProgressError();
    }
  }

  /**
   * Creates a new game from a completed game. The new game will have the same code, name, password, and players as the existing game.
   * @param existingGameId The ID of the existing game
   * @param user The user creating the new game
   * @param session The session to use for the transaction
   * @returns A tuple of the new game and chef objects
   */
  public async performCreateNewGameFromExistingAsync(
    existingGameId: DefaultIdType,
    user: IUserDocument,
    session?: ClientSession,
  ): Promise<IGameChef> {
    return await this.withTransaction<IGameChef>(async (session) => {
      const existingGame = await this.getGameByIdOrThrowAsync(
        existingGameId,
        true,
        session,
      );
      this.validateCreateNewGameFromExistingOrThrow(existingGame);
      return await this.createNewGameFromExistingAsync(
        existingGame,
        user,
        session,
      );
    }, session);
  }

  /**
   * Starts the specified game
   * @param game The game to start
   * @returns A tuple of the game and the start game action
   */
  public async startGameAsync(game: IGameDocument): Promise<IGameAction> {
    // set the current bid to 0
    game.currentBid = 0;
    // set the current chef to the first player
    game.currentChef = 0;
    // set the game phase to SETUP
    game.currentPhase = GamePhase.SETUP;
    // set the current round to 0
    game.currentRound = 0;
    // create a random order of players
    // shuffle the chef ids
    game.turnOrder = UtilityService.shuffleArray(game.chefIds);
    // save the game
    const savedGame = await game.save();
    const startAction = await this.actionService.startGameAsync(savedGame);
    // mark all chefs as PLAYING
    const chefs = await this.chefService.getGameChefsByGameOrIdAsync(savedGame);
    chefs.forEach((chef) => {
      chef.state = ChefState.PLAYING;
      chef.save();
    });
    return { game: savedGame, action: startAction };
  }

  /**
   * Validates that the specified game can be started or throws a validation error
   * @param game The game to start
   * @param userId The ID of the user starting the game
   */
  public async validateStartGameOrThrowAsync(
    game: IGameDocument,
    userId: DefaultIdType,
  ): Promise<void> {
    if (!(await this.playerService.isMasterChefAsync(userId, game._id))) {
      throw new MustBeMasterChefError();
    }
    if (game.currentPhase !== GamePhase.LOBBY) {
      throw new GameInProgressError();
    }
    if (game.chefIds.length < constants.MIN_CHEFS) {
      throw new NotEnoughChefsError(game.chefIds.length);
    }
  }

  /**
   * Starts the specified game
   * @param gameCode The code of the game to start
   * @param userId The ID of the user starting the game
   * @param session The session to use for the transaction
   * @returns
   */
  public async performStartGameAsync(
    gameCode: string,
    userId: DefaultIdType,
    session?: ClientSession,
  ): Promise<IGameAction> {
    return await this.withTransaction<IGameAction>(async () => {
      const game = await this.getGameByCodeOrThrowAsync(gameCode, true);
      await this.validateStartGameOrThrowAsync(game, userId);
      return await this.startGameAsync(game);
    }, session);
  }

  /**
   * Validates that the specified game can be ended or throws a validation error
   * @param game The game to end
   * @param userId The ID of the user ending the game
   * @param reason The reason the game is ending
   */
  public async validateEndGameOrThrowAsync(
    game: IGameDocument,
    userId: DefaultIdType,
    reason: EndGameReason,
  ): Promise<void> {
    if (!(await this.playerService.isMasterChefAsync(userId, game._id))) {
      throw new MustBeMasterChefError();
    }
    if (game.currentPhase === GamePhase.GAME_OVER) {
      throw new GameEndedError();
    }
    if (reason === EndGameReason.INACTIVE) {
      throw new InvalidEndGameReasonError(reason);
    }
  }

  /**
   * Ends the specified game
   * @param game The game to end
   * @param reason The reason the game is ending
   * @param session The session to use for the transaction
   * @returns The ended game
   */
  public async endGameAsync(
    game: IGameDocument,
    reason: EndGameReason,
    session?: ClientSession,
  ): Promise<IGameAction<IGameDocument, IEndGameActionDocument>> {
    game.currentPhase = GamePhase.GAME_OVER;
    const savedGame = await game.save({ session });
    const action = await this.actionService.endGameAsync(
      savedGame,
      reason,
      session,
    );
    return { game: savedGame, action };
  }

  /**
   * Ends the specified game
   * @param gameCode The code of the game to end
   * @param userId The ID of the user ending the game
   * @param session The session to use for the transaction
   * @returns The ended game
   */
  public async performEndGameAsync(
    gameCode: string,
    reason: EndGameReason,
    userId: DefaultIdType,
    session?: ClientSession,
  ): Promise<IGameAction<IGameDocument, IEndGameActionDocument>> {
    return await this.withTransaction<
      IGameAction<IGameDocument, IEndGameActionDocument>
    >(async (session) => {
      const game = await this.getGameByCodeOrThrowAsync(
        gameCode,
        true,
        session,
      );
      await this.validateEndGameOrThrowAsync(game, userId, reason);
      return await this.endGameAsync(game, reason, session);
    }, session);
  }

  /**
   * Gets a Game model by game ID
   * @param gameId The ID of the game
   * @param active Whether the game must be active
   * @returns Game model
   */
  public async getGameByIdOrThrowAsync(
    gameId: DefaultIdType,
    active = false,
    session?: ClientSession,
  ): Promise<IGameDocument> {
    const GameModel = this.application.getModel<IGameDocument>(ModelName.Game);
    const search = active
      ? {
          _id: gameId,
          currentPhase: { $ne: GamePhase.GAME_OVER },
        }
      : { _id: gameId };
    const game = await GameModel.findOne(search).session(session);
    if (!game) {
      throw new InvalidGameError();
    }
    return game;
  }

  /**
   * Gets a Game model by game code
   * @param gameCode The code of the game
   * @param active Whether the game must be active
   * @returns Game model
   */
  public async getGameByCodeOrThrowAsync(
    gameCode: string,
    active = false,
    session?: ClientSession,
  ): Promise<IGameDocument> {
    const GameModel = this.application.getModel<IGameDocument>(ModelName.Game);
    // Construct the search criteria
    const search = active
      ? { code: gameCode, currentPhase: { $ne: GamePhase.GAME_OVER } }
      : { code: gameCode };

    // Create the query
    const query = GameModel.find(search)
      .sort({ updatedAt: -1 })
      .limit(1)
      .session(session);

    // Execute the query and get the results
    const games = await query.exec();

    if (!games || games.length == 0) {
      throw new InvalidGameError();
    }

    // return the first game
    return games[0];
  }

  /**
   * Expires the specified games
   * @param games A collection of games to expire
   */
  public async expireGamesOrThrowAsync(
    games: Array<IGameDocument>,
  ): Promise<void> {
    for (const game of games) {
      // set currentPhase to GAME_OVER
      game.currentPhase = GamePhase.GAME_OVER;
      const savedGame = await game.save();
      // TODO: close any sockets for this game
      await this.actionService.expireGameAsync(savedGame);
      // set all chefs to EXPIRED
      const chefs =
        await this.chefService.getGameChefsByGameOrIdAsync(savedGame);
      chefs.forEach((chef) => {
        chef.state = ChefState.EXPIRED;
        chef.save();
      });
    }
  }

  /**
   * Finds games not in GAME_OVER phase with a lastModified date older than MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES and marks them GAME_OVER
   * @param session The session to use for the transaction
   */
  public async performExpireOldGamesAsync(
    session?: ClientSession,
  ): Promise<void> {
    const GameModel = this.application.getModel<IGameDocument>(ModelName.Game);
    return await this.withTransaction<void>(async () => {
      // find games not in GAME_OVER phase with a lastModified date older than MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES
      // cutoffDate is now minus MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES
      const cutoffDate = new Date();
      cutoffDate.setMinutes(
        cutoffDate.getMinutes() -
          constants.MAX_GAME_AGE_WITHOUT_ACTIVITY_IN_MINUTES,
      );
      const games = await GameModel.find({
        currentPhase: { $ne: GamePhase.GAME_OVER },
        lastModified: { $lt: cutoffDate },
      }).session(session);
      if (games && games.length > 0) {
        await this.expireGamesOrThrowAsync(games);
      }
    }, session);
  }

  /**
   * Validates that the specified chef can place a card or throws a validation error
   * @param message The message to validate
   */
  public validateSendMessageOrThrow(message: string): void {
    if (
      message.length < constants.MIN_MESSAGE_LENGTH ||
      message.length > constants.MAX_MESSAGE_LENGTH
    ) {
      throw new InvalidMessageError();
    }
  }

  /**
   * Sends a message to all players in the specified game
   * @param game The game to send the message to
   * @param chef The chef sending the message
   * @param message The message to send
   * @returns The message action object
   */
  public async sendMessageAsync(
    game: IGameDocument,
    chef: IChefDocument,
    message: string,
  ): Promise<IMessageActionDocument> {
    return await this.actionService.sendMessageAsync(game, chef, message);
  }

  /**
   * Sends a message to all players in the specified game
   * @param gameCode The game code of an active game
   * @param user The user sending the message
   * @param message The message to send
   * @param session The session to use for the transaction
   * @returns The message action object
   */
  public async performSendMessageAsync(
    gameCode: string,
    user: IUserDocument,
    message: string,
    session?: ClientSession,
  ): Promise<IMessageActionDocument> {
    this.validateSendMessageOrThrow(message);
    return await this.withTransaction<IMessageActionDocument>(async () => {
      const game = await this.getGameByCodeOrThrowAsync(gameCode, true);
      const chef = await this.chefService.getGameChefOrThrowAsync(game, user);
      return await this.sendMessageAsync(game, chef, message);
    }, session);
  }

  /**
   * Gets all chef names for the specified game
   * @param gameId
   * @returns Array of chef names
   */
  public async getGameChefNamesByGameIdAsync(
    gameId: string,
  ): Promise<string[]> {
    const chefs = await this.chefService.getGameChefsByGameOrIdAsync(gameId);
    return chefs.map((chef) => chef.name);
  }

  /**
   * Return whether the current chef can bid
   * @param game The game being evaluated
   * @param chef The chef being evaluated
   * @returns boolean with whether the chef can bid
   */
  public canBid(game: IGameDocument, chef: IChefDocument): boolean {
    // current phase must be SETUP or BIDDING
    if (
      game.currentPhase !== GamePhase.BIDDING &&
      game.currentPhase !== GamePhase.SETUP
    ) {
      return false;
    }
    // the current chef must be the user
    const currentChefId = this.getGameCurrentChefId(game);
    if (currentChefId.toString() !== chef._id.toString()) {
      return false;
    }
    // there must not be no cards placed yet
    if (game.cardsPlaced == 0) {
      return false;
    }
    // the minimum bid is game.currentBid + 1
    const minimumBid = game.currentBid + 1;
    // we must be able to bid at least one card, but no more than the number of cards placed
    if (minimumBid > game.cardsPlaced) {
      return false;
    }
    return true;
  }

  /**
   * Return whether the given chef can place a card
   * @param game
   * @param chef
   * @returns
   */
  public canPlaceCard(game: IGameDocument, chef: IChefDocument): boolean {
    // current phase must be SETUP
    if (game.currentPhase !== GamePhase.SETUP) {
      return false;
    }
    // the current chef must be the user
    const currentChefId = this.getGameCurrentChefId(game);
    if (currentChefId.toString() !== chef._id.toString()) {
      return false;
    }
    // the chef must have cards left in their hand
    if (chef.hand.length == 0) {
      return false;
    }
    return true;
  }

  /**
   * Return whether the given chef can pass on bidding or increasing the bid.
   * @param game
   * @param chef
   */
  public canPass(game: IGameDocument, chef: IChefDocument): boolean {
    // the current chef must be the user
    const currentChefId = this.getGameCurrentChefId(game);
    if (currentChefId.toString() !== chef._id.toString()) {
      return false;
    }
    // current phase must be BIDDING
    // the current phase being bidding eliminates the possibility of passing during the placing cards phase
    if (game.currentPhase !== GamePhase.BIDDING) {
      return false;
    }
    // if no one has bid yet, the the chef must make a bid
    if (game.currentBid <= 0) {
      return false;
    }
    /* if the previous chef bid the maximum number of cards, they automatically must reveal cards
     * and bidding should not have moved to the next player
     * the game phase should have moved to REVEAL
     * therefore, the current chef cannot pass
     */
    if (game.currentBid == game.cardsPlaced) {
      return false;
    }
    /* Whenever the bid is increased, all other players have the opportunity to increase it further or pass
       unless the bid is the maximum and we immediately move to the next phase.
       If the second player in the turn order increases the bid, we must go through the remainder of the players
       in the turn order and back through the first before moving to REVEAL phase.
    */
    if (this.haveAllRemainingPlayersPassed(game)) {
      return false;
    }
    return true;
  }

  /**
   * Returns the available actions to the current chef
   * This will return an empty array if the chef passed in is not the current chef
   * @param game
   * @param chef
   * @returns An array of available actions
   */
  public availableTurnActions(
    game: IGameDocument,
    chef: IChefDocument,
  ): TurnAction[] {
    const actions: TurnAction[] = [];
    if (this.canPlaceCard(game, chef)) {
      actions.push(TurnAction.PlaceCard);
    }
    if (this.canPass(game, chef)) {
      actions.push(TurnAction.Pass);
    }
    const canBid = this.canBid(game, chef);
    const existingBid = game.currentBid > 0;
    // if there has been at least one bid, users can increase the bid
    if (canBid && existingBid) {
      actions.push(TurnAction.IncreaseBid);
      // otherwise they can make a bid
    } else if (canBid) {
      actions.push(TurnAction.Bid);
    }
    return actions;
  }

  /**
   * Gets the current chef ID from the current game
   * @param game The game being evaluated
   * @throws Error if currentChef is invalid
   * @returns ObjectID of the current chef
   */
  public getGameCurrentChefId(game: IGameDocument): DefaultIdType {
    if (game.currentChef < 0 || game.currentChef >= game.turnOrder.length) {
      throw new Error(`Invalid current chef index: ${game.currentChef}`);
    }
    return game.turnOrder[game.currentChef];
  }

  /**
   * Returns whether the given chef has at least one card of the specified ingredient.
   * @param chef The chef being tested
   * @param ingredient The ingredient being searched for
   * @returns boolean with whether the card was found
   */
  public hasIngredientInHand(
    chef: IChefDocument,
    ingredient: CardType,
  ): boolean {
    return chef.hand.filter((card) => card.type == ingredient).length > 0;
  }

  /**
   * Validates that the specified chef can place a card or throws a validation error
   * @param game The game to validate
   * @param chef The chef to validate
   * @param ingredient The ingredient to place
   */
  public validatePlaceIngredientOrThrow(
    game: IGameDocument,
    chef: IChefDocument,
    ingredient: CardType,
  ): void {
    if (game.currentPhase !== GamePhase.SETUP) {
      throw new IncorrectGamePhaseError();
    }
    const currentChefId = this.getGameCurrentChefId(game);
    if (currentChefId.toString() !== chef._id.toString()) {
      throw new NotYourTurnError();
    }
    if (
      chef.placedCards.length >= constants.HAND_SIZE ||
      chef.hand.length == 0
    ) {
      throw new AllCardsPlacedError();
    }
    // can the chef place a card in general
    if (!this.canPlaceCard(game, chef)) {
      throw new InvalidActionError(TurnAction.PlaceCard);
    }
    // can they specifically place the given card
    if (!this.hasIngredientInHand(chef, ingredient)) {
      throw new OutOfIngredientError(ingredient);
    }
  }

  /**
   * Places a card for the specified chef
   * @param game The game to place the card in
   * @param chef The chef placing the card
   * @param ingredient The ingredient to place
   * @returns A tuple of the updated game and chef objects
   */
  public async placeIngredientAsync(
    game: IGameDocument,
    chef: IChefDocument,
    ingredient: CardType,
  ): Promise<IGameChef> {
    // remove one card of the specified type from the chef's hand
    const ingredientIndex = chef.hand.findIndex(
      (card) => card.type == ingredient,
    );
    if (ingredientIndex < 0) {
      throw new OutOfIngredientError(ingredient);
    }
    chef.hand.splice(ingredientIndex, 1);
    // add the card to the chef's placed cards
    chef.placedCards.push({ type: ingredient, faceUp: false });
    const savedChef = await chef.save();
    // increment the current chef
    game.currentChef = (game.currentChef + 1) % game.chefIds.length;
    // after placing a card we will have to perform some checks on what has to happen next
    // there may be no more cards to place and we may need to move to bidding, etc
    // this will happen in performTurnActionAsync()
    const savedGame = await game.save();
    return { game: savedGame, chef: savedChef };
  }

  /**
   * When the game is in setup phase, the current player can place a card or make a bid. This method places a card.
   * @param game The game to place the card in
   * @param chef The chef placing the card
   * @param ingredient The ingredient to place
   * @param session The session to use for the transaction
   * @returns A tuple of the updated game and chef objects
   */
  public async performPlaceIngredientAsync(
    game: IGameDocument,
    chef: IChefDocument,
    ingredient: CardType,
    session?: ClientSession,
  ): Promise<IGameChef> {
    this.validatePlaceIngredientOrThrow(game, chef, ingredient);
    return await this.withTransaction<IGameChef>(async () => {
      return await this.placeIngredientAsync(game, chef, ingredient);
    }, session);
  }

  /**
   * Validates that the specified chef can increase the bid or throws a validation error
   * @param game The game to validate
   * @param chef The chef to validate
   * @param bid The bid to place
   */
  public validateMakeBidOrThrow(
    game: IGameDocument,
    chef: IChefDocument,
    bid: number,
  ): void {
    if (!this.canBid(game, chef)) {
      throw new InvalidActionError(TurnAction.Bid);
    }
    if (bid < game.currentBid + 1 || bid > game.cardsPlaced) {
      throw new InvalidActionError(TurnAction.Bid, bid);
    }
  }

  /**
   * Makes a bid for the specified chef
   * @param game The game to bid in
   * @param chef The chef making the bid
   * @param bid The bid to make
   * @returns A tuple of the updated game and chef objects
   */
  public async makeBidAsync(
    game: IGameDocument,
    chef: IChefDocument,
    bid: number,
  ): Promise<IGameChef> {
    const firstBid = game.currentBid <= 0;
    // set the current bid
    game.currentBid = bid;
    // increment the current chef
    game.currentChef = (game.currentChef + 1) % game.chefIds.length;
    // just set the current phase to bidding, even if we might have to change phases after the bid
    // eg because the bid was the same as the number of cards placed and no one else can bid
    // after each turn action, we will have to perform some checks on what has to happen next
    if (game.currentPhase == GamePhase.SETUP && firstBid) {
      game.currentPhase = GamePhase.BIDDING;
    }
    // create a new round bid
    const roundBid: IBid = {
      chefId: chef._id,
      bid: bid,
      pass: false,
    };
    if (game.roundBids[game.currentRound] === undefined) {
      game.roundBids[game.currentRound] = [];
    }
    game.roundBids[game.currentRound].push(roundBid);
    if (firstBid) {
      await this.actionService.startBiddingAsync(game, chef, bid);
    }
    const savedGame = await game.save();
    return { game: savedGame, chef };
  }

  /**
   * Rather than placing a card, the current player can make a bid. This method makes a bid.
   * The game phase will move from SETUP to BIDDING
   * @param game The game to bid in
   * @param chef The chef making the bid
   * @param bid The bid to make
   */
  public async performMakeBidAsync(
    game: IGameDocument,
    chef: IChefDocument,
    bid: number,
  ): Promise<IGameChef> {
    this.validateMakeBidOrThrow(game, chef, bid);
    return await this.makeBidAsync(game, chef, bid);
  }

  /**
   * Determines whether all remaining players have passed since the last non-passing bid
   * @param game The game to check
   * @returns True if all remaining players have passed since the last non-passing bid, false otherwise
   */
  public haveAllRemainingPlayersPassed(game: IGameDocument): boolean {
    // Get the bids for the current round
    const currentRoundBids = game.roundBids[game.currentRound];

    // If there are no bids in the current round, we return false because we can't have passes without bids
    if (!currentRoundBids || currentRoundBids.length === 0) {
      return false;
    }

    // Find the most recent non-passing bid in the current round
    const lastNonPassingBid = currentRoundBids
      .slice()
      .reverse()
      .find((bid) => !bid.pass);

    // If no such bid exists, then return false since we need at least one non-passing bid
    if (!lastNonPassingBid) {
      return false;
    }

    // Get the index of the last non-passing bid
    const lastNonPassingBidIndex = currentRoundBids.findIndex(
      (bid) => bid.chefId.toString() === lastNonPassingBid.chefId.toString(),
    );

    // Create a list of chefIds who have made a bid since the last non-passing bid (including the chef who made it)
    const subsequentChefIds = currentRoundBids
      .slice(lastNonPassingBidIndex)
      .map((bid) => bid.chefId.toString());

    // Find all unique chefIds who have passed since the last non-passing bid (excluding the chef who made the bid)
    const uniquePassingChefIds = [
      ...new Set(
        subsequentChefIds.filter((chefId, index) => {
          return (
            currentRoundBids[lastNonPassingBidIndex + index].pass &&
            chefId !== lastNonPassingBid.chefId.toString()
          );
        }),
      ),
    ];

    // Determine if all other chefs have passed since the last non-passing bid
    const allOtherChefsHavePassed = game.chefIds.every((chefId) => {
      // The chef who made the last non-passing bid is not expected to have passed
      return (
        chefId.toString() === lastNonPassingBid.chefId.toString() ||
        uniquePassingChefIds.includes(chefId.toString())
      );
    });

    return allOtherChefsHavePassed;
  }

  /**
   * Validates that the specified chef can pass on bidding or throws a validation error
   * @param game The game to validate
   * @param chef The chef to validate
   */
  public validatePerformPassOrThrow(
    game: IGameDocument,
    chef: IChefDocument,
  ): void {
    if (!this.canPass(game, chef)) {
      throw new InvalidActionError(TurnAction.Pass);
    }
  }

  /**
   * Passes on increasing the bid
   * @param game The game to pass in
   * @param chef The chef passing
   * @returns A tuple of the updated game and chef objects
   */
  public async passAsync(
    game: IGameDocument,
    chef: IChefDocument,
  ): Promise<IGameChef> {
    // create pass event/action
    await this.actionService.passAsync(game, chef);
    // increment the current chef
    game.currentChef = (game.currentChef + 1) % game.chefIds.length;
    // create a new round bid history
    const roundBid: IBid = {
      chefId: chef._id,
      bid: game.currentBid,
      pass: true,
    };
    if (game.roundBids[game.currentRound] === undefined) {
      throw new Error('Cannot pass before the first bid');
    }
    game.roundBids[game.currentRound].push(roundBid);
    const savedGame = await game.save();
    return { game: savedGame, chef };
  }

  /**
   * A chef passes on increasing the bid
   * @param game The game to pass in
   * @param chef The chef passing
   */
  public async performPassAsync(
    game: IGameDocument,
    chef: IChefDocument,
  ): Promise<IGameChef> {
    this.validatePerformPassOrThrow(game, chef);
    return await this.passAsync(game, chef);
  }

  /**
   * A user performs a turn action
   * @param gameCode
   * @param user
   * @param action
   * @param value
   * @param session The session to use for the transaction
   * @returns
   */
  public async performTurnActionAsync(
    gameCode: string,
    user: IUserDocument,
    action: TurnAction,
    value?: IBidIngredient,
    session?: ClientSession,
  ): Promise<IGameChef> {
    return await this.withTransaction<IGameChef>(async () => {
      const game = await this.getGameByCodeOrThrowAsync(gameCode, true);
      if (game.chefIds[game.currentChef].toString() !== user._id.toString()) {
        throw new NotYourTurnError();
      }
      const chef = await this.chefService.getGameChefOrThrowAsync(game, user);
      // BID, INCREASE_BID, PASS, or PLACE_CARD
      const availableActions = this.availableTurnActions(game, chef);
      if (!availableActions.includes(action)) {
        throw new InvalidActionError(action, value?.bid, value?.ingredient);
      }
      let result: IGameChef | undefined = undefined;
      switch (action) {
        case TurnAction.Bid:
        case TurnAction.IncreaseBid:
          if (!value.bid) {
            throw new InvalidActionError(action);
          }
          result = await this.performMakeBidAsync(game, chef, value.bid);
          break;
        case TurnAction.PlaceCard:
          if (!value.ingredient) {
            throw new InvalidActionError(action);
          }
          result = await this.performPlaceIngredientAsync(
            game,
            chef,
            value.ingredient,
          );
          break;
        case TurnAction.Pass:
          result = await this.performPassAsync(game, chef);
          break;
        default:
          throw new InvalidActionError(action);
      }
      // TODO determine next state, transition current phase, etc
      return result;
    }, session);
  }

  public async verifyUserIsParticipantAsync(
    userId: string,
    gameCode: string,
    active = false,
  ): Promise<boolean> {
    // look for chefs in the chefs collection with a game id that matches a record in the games collection with the specified game code- also check if the game is active if requested
    // get a document count for a query with a lookup to the games collection
    const ChefModel = this.application.getModel<IChefDocument>(ModelName.Chef);
    const query = ChefModel.aggregate([
      {
        $lookup: {
          from: 'games',
          localField: 'gameId',
          foreignField: '_id',
          as: 'game',
        },
      },
      {
        $match: {
          userId: new Types.ObjectId(userId),
          'game.code': gameCode,
          ...(active
            ? { 'game.currentPhase': { $ne: GamePhase.GAME_OVER } }
            : {}),
        },
      },
    ]);
    // get the document count from the query
    const count = await query.count('game');
    const result =
      Array.isArray(count) &&
      count.length > 0 &&
      'game' in count[0] &&
      (count[0].game as number) > 0;
    return result;
  }

  /**
   * Returns the history of actions for the specified game
   * @param gameId The ID of the game
   * @param session The session to use
   * @returns An array of action documents
   */
  public async getGameHistoryAsync(
    gameId: DefaultIdType,
    session?: ClientSession,
  ): Promise<IActionDocument[]> {
    const ActionModel = this.application.getModel<IActionDocument>(
      ModelName.Action,
    );
    return await ActionModel.find({ gameId: gameId })
      .sort({
        createdAt: 1,
      })
      .session(session);
  }
}
