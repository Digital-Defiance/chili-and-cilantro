import {
  IApiErrorResponse,
  IPusherAppInfoResponse,
  StringNames,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  ApiResponse,
  IApplication,
  RouteConfig,
  SendFunction,
  routeConfig,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import Pusher from 'pusher';
import { environment } from '../../environment';
import { UserService } from '../../services/user';
import { BaseController } from '../base';

export class PusherController extends BaseController {
  private readonly pusher: Pusher;
  constructor(application: IApplication) {
    super(application);
    this.pusher = new Pusher({
      appId: environment.pusher.appId,
      key: environment.pusher.key,
      secret: environment.pusher.secret,
      cluster: environment.pusher.cluster,
      useTLS: true,
    });
  }

  public getRoutes(): RouteConfig<ApiResponse, any, Array<unknown>>[] {
    return [
      routeConfig<ApiResponse, true, Array<unknown>>({
        method: 'post',
        path: '/auth',
        handler: this.authenticatePusher.bind(this),
        useAuthentication: true,
        authFailureStatusCode: 403,
        validation: [
          body('socket_id').isString().notEmpty(),
          body('channel_name').isString().notEmpty(),
        ],
      }),
      routeConfig<ApiResponse, true, Array<unknown>>({
        method: 'get',
        path: '/appInfo',
        handler: this.getAppInfo.bind(this),
        useAuthentication: true,
      }),
    ];
  }

  private async getAppInfo(
    req: Request,
    res: Response,
    send: SendFunction<IPusherAppInfoResponse | IApiErrorResponse>,
    next: NextFunction,
  ): Promise<void> {
    if (!req.user) {
      const errorMessage = translate(StringNames.Common_Unauthorized);
      send(
        401,
        {
          message: errorMessage,
          error: new Error(errorMessage),
        },
        res,
      );
      return;
    }
    send(
      200,
      {
        message: translate(StringNames.Common_Success),
        appKey: environment.pusher.key,
        cluster: environment.pusher.cluster,
      },
      res,
    );
  }

  private async authenticatePusher(
    req: Request,
    res: Response,
    send: SendFunction<Pusher.UserAuthResponse>,
    next: NextFunction,
  ): Promise<void> {
    const user = await this.validateAndFetchRequestUser(req, res, next);
    const socketId = req.validatedBody.socket_id;
    const channel = req.validatedBody.channel_name;

    const presenceData = channel.startsWith('presence-')
      ? {
          user_id: user._id.toString(),
          user_info: { name: user.username },
        }
      : null;

    const authResponse = this.pusher.authenticateUser(socketId, {
      id: user._id.toString(),
      user_info: UserService.userToUserObject(user),
      watchlist: [],
    });
    send(200, authResponse, res);
  }
}
