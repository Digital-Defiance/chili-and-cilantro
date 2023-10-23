import { GetUsers200ResponseOneOfInner } from 'auth0';
import {
  JwtHeader,
  JwtPayload,
  SigningKeyCallback,
  verify,
} from 'jsonwebtoken';
import { JwksClient, SigningKey } from 'jwks-rsa';
import { environment } from '../environment';
import { managementClient } from '../auth0';
import { Document } from 'mongoose';
import { Request, Response } from 'express';
import { UserService } from './userService';
import { IUser } from '@chili-and-cilantro/chili-and-cilantro-lib';

export class JwtService {
  private client: JwksClient;

  constructor() {
    this.client = new JwksClient({
      jwksUri: `https://${environment.auth0.domain}/.well-known/jwks.json`,
    });
  }

  private getKey(header: JwtHeader, callback: SigningKeyCallback): void {
    if (!header.kid) throw new Error('No KID found in JWT');

    this.client.getSigningKey(
      header.kid,
      (err: Error | null, key?: SigningKey) => {
        if (err) {
          callback(err);
        } else {
          const signingKey = key?.getPublicKey();
          callback(null, signingKey);
        }
      },
    );
  }

  async validateAccessTokenAndFetchAuth0User(
    frontEndAccessToken: string,
  ): Promise<GetUsers200ResponseOneOfInner> {
    const decoded = await new Promise<JwtPayload | null>((resolve, reject) => {
      verify(
        frontEndAccessToken,
        this.getKey.bind(this),
        { algorithms: ['RS256'] },
        (err, decoded) => {
          if (err) {
            reject(new Error(`Token Verification Failed: ${err.message}`));
          } else {
            resolve(decoded as JwtPayload);
          }
        },
      );
    });

    if (!decoded || !decoded.sub) {
      throw new Error('Invalid token');
    }

    const apiResponse = await managementClient.users.get({ id: decoded.sub });

    if (!apiResponse || (apiResponse.status !== 200)) {
      throw new Error('User not found');
    }

    return apiResponse.data;
  }

  public async authenticateUser(
    req: Request,
    res: Response,
    next: (appUser: Document & IUser, auth0User: GetUsers200ResponseOneOfInner) => void,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token not found' });
    }
    try {
      const auth0User =
        await this.validateAccessTokenAndFetchAuth0User(accessToken);
      if (!auth0User.user_id) {
        return res.status(401).json({ message: 'Unable to determine user id' });
      }

      const user = await UserService.getUserByAuth0Id(auth0User.user_id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next(user, auth0User);
    }
    catch (ex) {
      return res.status(401).json({ message: 'Invalid access token' });
    }
  }

  /**
   * Decodes the provided JWT, extracts the Auth0 user ID, and fetches the corresponding user from MongoDB.
   * This function assumes the JWT has already been validated.
   * 
   * @param token The already validated JWT.
   * @returns The user data from MongoDB corresponding to the Auth0 user ID in the token.
   */
  public async getUserFromValidatedToken(token: string): Promise<Document & IUser | null> {
    // Decode the token (without verification)
    const decoded = await new Promise<JwtPayload | null>((resolve, reject) => {
      verify(
        token,
        this.getKey.bind(this),
        { algorithms: ['RS256'] },
        (err, decoded) => {
          if (err) {
            reject(new Error(`Token Verification Failed: ${err.message}`));
          } else {
            resolve(decoded as JwtPayload);
          }
        },
      );
    });

    if (!decoded || !decoded.sub) {
      throw new Error('Invalid token: unable to extract payload or user ID');
    }

    // The 'sub' field in Auth0 tokens holds the Auth0 user ID
    const auth0UserId = decoded.sub;

    // Fetch the user from MongoDB using the Auth0 user ID
    const user = await UserService.getUserByAuth0Id(auth0UserId);

    if (!user) {
      throw new Error('User not found in database');
    }

    return user;
  }
}
