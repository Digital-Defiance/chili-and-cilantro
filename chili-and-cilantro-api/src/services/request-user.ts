import {
    IRequestUser,
    IUserDocument,
  } from '@chili-and-cilantro/chili-and-cilantro-lib';
  
  export class RequestUserService {
    /**
     * Given a user document and an array of role documents, create the IRequestUser
     * @param userDoc
     * @param roles
     * @returns
     */
    public static makeRequestUser(
      userDoc: IUserDocument,
    ): IRequestUser {
      if (!userDoc._id) {
        throw new Error('User document is missing _id');
      }
      const requestUser: IRequestUser = {
        id: userDoc._id.toString(),
        email: userDoc.email,
        username: userDoc.username,
        timezone: userDoc.timezone,
        lastLogin: userDoc.lastLogin,
        emailVerified: userDoc.emailVerified,
      };
      return requestUser;
    }
  }
  