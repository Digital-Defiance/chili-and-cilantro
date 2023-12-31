import sinon from 'sinon';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';
import { IUser } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { GetUsers200ResponseOneOfInner } from 'auth0';
import JwksRsa, { JwksClient, SigningKey } from 'jwks-rsa';
import { JwtService } from '../../src/services/jwt';
import { managementClient } from '../../src/auth0';
import { UserService } from '../../src/services/user';
import { generateUser } from '../fixtures/user';

jest.mock('jwks-rsa', () => ({
  JwksClient: jest.fn().mockImplementation(() => ({
    getSigningKey: jest.fn().mockImplementation((kid, callback) => {
      callback(null, { getPublicKey: () => 'mock-signing-key' } as unknown as SigningKey);
    }),
  })),
}));
jest.mock('../../src/auth0', () => ({
  managementClient: {
    users: {
      get: jest.fn(),
    },
  },
}));
jest.mock('../../src/services/user', () => {
  return {
    UserService: jest.fn().mockImplementation(() => {
      return {
        getUserByAuth0IdOrThrow: jest.fn(),
      };
    }),
  };
});
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn(),
}));

describe('JwtService', () => {
  let jwtService: JwtService;
  let userService: jest.Mocked<UserService>;
  let mockRequest: { headers: { authorization?: string } };
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let nextFunction: jest.Mock;

  beforeEach(() => {
    userService = new UserService() as jest.Mocked<UserService>;
    jwtService = new JwtService(userService);
    mockRequest = { headers: { authorization: 'Bearer token' } };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    (JwksClient as jest.Mock).mockClear();
    (managementClient.users.get as jest.Mock).mockClear();
    (jwt.verify as jest.Mock).mockClear();
  });

  describe('validateAccessTokenAndFetchAuth0UserAsync', () => {
    it('should validate token and fetch user', async () => {
      // Mock the JWT verification and user fetching process
      const mockDecodedToken: JwtPayload = { sub: 'user-id' };
      const mockAuth0User: GetUsers200ResponseOneOfInner = { user_id: 'user-id', name: 'Test User' } as any;

      // Mocking the JWT verify callback behavior
      jest.spyOn(jwt, 'verify').mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        if (callback) {
          callback(null, mockDecodedToken);
        }
      });

      // Mocking the managementClient to return a successful response
      (managementClient.users.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: mockAuth0User,
      });

      // Call the method with a mock token
      const result = await jwtService.validateAccessTokenAndFetchAuth0UserAsync('mock-token');

      // Assertions
      expect(result).toEqual(mockAuth0User);
      expect(managementClient.users.get).toHaveBeenCalledWith({ id: mockDecodedToken.sub });
    });

    it('should throw an error for invalid token', async () => {
      // Mock the JWT verify to simulate an invalid token
      jest.spyOn(jwt, 'verify').mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        const error = new jwt.JsonWebTokenError('Invalid token');
        if (callback) {
          callback(error, undefined);
        }
      }),

        // Attempt to call the method with an invalid token and expect an error
        await expect(jwtService.validateAccessTokenAndFetchAuth0UserAsync('invalid-token'))
          .rejects
          .toThrow('Invalid token');

      // Ensure that the managementClient's get method is not called
      expect(managementClient.users.get).not.toHaveBeenCalled();
    });

    it('should throw an error for invalid decoded token', async () => {
      // Mock verify to return a decoded token without 'sub'
      (jwt.verify as jest.Mock).mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        callback(null, {}); // No 'sub' field
      });

      // Expect an error when calling validateAccessTokenAndFetchAuth0UserAsync
      await expect(jwtService.validateAccessTokenAndFetchAuth0UserAsync('token')).rejects.toThrow('Invalid token');
    });

    it('should throw an error when Auth0 user is not found', async () => {
      // Mock verify to return a valid decoded token
      (jwt.verify as jest.Mock).mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        callback(null, { sub: 'user-id' });
      });

      // Mock managementClient to simulate user not found
      (managementClient.users.get as jest.Mock).mockResolvedValue({ status: 404 });

      // Expect an error when calling validateAccessTokenAndFetchAuth0UserAsync
      await expect(jwtService.validateAccessTokenAndFetchAuth0UserAsync('token')).rejects.toThrow('User not found');
    });
  });

  describe('authenticateUserAsync', () => {
    it('should authenticate user and call next function', async () => {
      // Mock the JWT verification and user fetching process
      const mockDecodedToken: JwtPayload = { sub: 'user-id' };
      const mockAuth0User: GetUsers200ResponseOneOfInner = { user_id: 'user-id', name: 'Test User' } as any;

      // Mocking the JWT verify callback behavior
      jest.spyOn(jwt, 'verify').mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        if (callback) {
          callback(null, mockDecodedToken);
        }
      });

      // Mock the managementClient to return a successful response
      (managementClient.users.get as jest.Mock).mockResolvedValue({
        data: mockAuth0User,
        status: 200,
      });

      // Set up mock request with authorization header
      mockRequest.headers.authorization = 'Bearer valid-token';

      // mock userservice getUserByAuth0IdOrThrow to return a mock user
      const mockUser = generateUser({ auth0Id: mockAuth0User.user_id });
      const mockUserDocument = {
        ...mockUser,
        isModified: jest.fn().mockReturnValue(false),
        save: jest.fn(),
      } as any as Document & IUser;
      userService.getUserByAuth0IdOrThrow.mockResolvedValue(mockUserDocument);

      // Call the authenticateUserAsync method
      await jwtService.authenticateUserAsync(mockRequest as any, mockResponse as any, nextFunction);

      // Assertions
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(Function), expect.any(Object), expect.any(Function));
      expect(managementClient.users.get).toHaveBeenCalledWith({ id: mockDecodedToken.sub });
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 401 for missing access token', async () => {
      // Remove the authorization header to simulate a missing token
      delete mockRequest.headers.authorization;

      // Call the authenticateUserAsync method
      await jwtService.authenticateUserAsync(mockRequest as any, mockResponse as any, nextFunction);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Access token not found' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
    it('should return 401 if unable to determine user id', async () => {
      // mock an auth0user without a user_id
      const mockDecodedToken: JwtPayload = { sub: 'user-id' };
      const mockAuth0User: GetUsers200ResponseOneOfInner = { user_id: undefined, name: 'Test User' } as any;

      // Mocking the JWT verify callback behavior
      jest.spyOn(jwt, 'verify').mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        if (callback) {
          callback(null, mockDecodedToken);
        }
      });

      // Mock the managementClient to return a successful response
      (managementClient.users.get as jest.Mock).mockResolvedValue({
        data: mockAuth0User,
        status: 200,
      });

      // Set up mock request with authorization header
      mockRequest.headers.authorization = 'Bearer valid-token';

      // Call the authenticateUserAsync method
      await jwtService.authenticateUserAsync(mockRequest as any, mockResponse as any, nextFunction);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unable to determine user id' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
    it('should return 401 if user not found', async () => {
      // Mock the JWT verification to return a valid decoded token
      const mockDecodedToken: JwtPayload = { sub: 'user-id' };
      const mockAuth0User: GetUsers200ResponseOneOfInner = { user_id: 'user-id', name: 'Test User' } as any;

      // Mocking the JWT verify callback behavior
      jest.spyOn(jwt, 'verify').mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        if (callback) {
          callback(null, mockDecodedToken);
        }
      });

      // Mock the managementClient to return a successful response
      (managementClient.users.get as jest.Mock).mockResolvedValue({
        data: mockAuth0User,
        status: 200,
      });
      // Mock userService to simulate user not found
      userService.getUserByAuth0IdOrThrow.mockResolvedValue(null);

      // Call the authenticateUserAsync method
      await jwtService.authenticateUserAsync(mockRequest as any, mockResponse as any, nextFunction);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
    it('should return 401 for invalid access token', async () => {
      // Mock the JWT verification to simulate an invalid token
      (jwt.verify as jest.Mock).mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        callback(new jwt.JsonWebTokenError('Invalid access token'), null);
      });

      // Call the authenticateUserAsync method
      await jwtService.authenticateUserAsync(mockRequest as any, mockResponse as any, nextFunction);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid access token' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('getUserFromValidatedTokenAsync', () => {
    it('should fetch user from validated token', async () => {
      // Mock the JWT verification process
      const mockDecodedToken: JwtPayload = { sub: 'user-id' };
      jest.spyOn(jwt, 'verify').mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        if (callback) {
          callback(null, mockDecodedToken);
        }
      });

      // Mock the user service to return a user
      const mockUser = generateUser({ auth0Id: mockDecodedToken.sub });
      const mockUserDocument = {
        ...mockUser,
        isModified: jest.fn().mockReturnValue(false),
        save: jest.fn(),
      } as any as Document & IUser;
      userService.getUserByAuth0IdOrThrow.mockResolvedValue(mockUserDocument);

      // Call the getUserFromValidatedTokenAsync method with a mock token
      const user = await jwtService.getUserFromValidatedTokenAsync('valid-token');

      // Assertions
      expect(user).toEqual(mockUserDocument);
      expect(userService.getUserByAuth0IdOrThrow).toHaveBeenCalledWith(mockDecodedToken.sub);
    });

    it('should throw an error for invalid token', async () => {
      // Mock the JWT verification to simulate an invalid token
      jest.spyOn(jwt, 'verify').mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        const error = new jwt.JsonWebTokenError('Invalid token');
        if (callback) {
          callback(error, undefined);
        }
      });

      // Attempt to call the method with an invalid token and expect an error
      await expect(jwtService.getUserFromValidatedTokenAsync('invalid-token'))
        .rejects
        .toThrow('Token Verification Failed: Invalid token');

      // Ensure that the userService's getUserByAuth0IdOrThrow method is not called
      expect(userService.getUserByAuth0IdOrThrow).not.toHaveBeenCalled();
    });
    it('should throw an error for invalid token in getUserFromValidatedTokenAsync', async () => {
      // Mock the JWT verification to simulate an invalid token
      (jwt.verify as jest.Mock).mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        callback(new jwt.JsonWebTokenError('Invalid token'), null);
      });

      // Expect an error when calling getUserFromValidatedTokenAsync
      await expect(jwtService.getUserFromValidatedTokenAsync('invalid-token'))
        .rejects
        .toThrow('Token Verification Failed: Invalid token');
    });
    it('should throw an error if user not found in database in getUserFromValidatedTokenAsync', async () => {
      // Mock the JWT verification to return a valid decoded token
      (jwt.verify as jest.Mock).mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        callback(null, { sub: 'user-id' });
      });

      // Mock userService to simulate user not found
      userService.getUserByAuth0IdOrThrow.mockResolvedValue(null);

      // Expect an error when calling getUserFromValidatedTokenAsync
      await expect(jwtService.getUserFromValidatedTokenAsync('valid-token'))
        .rejects
        .toThrow('User not found in database');
    });
    it('should throw an error if there is not a sub field in the decoded token', async () => {
      // Mock the JWT verification to return a decoded token without 'sub'
      (jwt.verify as jest.Mock).mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        callback(null, {}); // No 'sub' field
      });

      // Expect an error when calling getUserFromValidatedTokenAsync
      await expect(jwtService.getUserFromValidatedTokenAsync('token'))
        .rejects
        .toThrow('Invalid token: unable to extract payload or user ID');
    });
  });
  describe('getKey', () => {
    let jwtService: JwtService;
    let mockJwksClient: jest.Mocked<JwksClient>;
    let mockUserService: jest.Mocked<UserService>;
    beforeEach(() => {
      mockJwksClient = new JwksClient({ jwksUri: 'mockUri' }) as any;
      mockUserService = {} as any; // Mock UserService as needed
      jwtService = new JwtService(mockUserService);
      (jwtService as any)['client'] = mockJwksClient;
    });
    it('should retrieve the signing key successfully', done => {
      const mockKey = { getPublicKey: () => 'mockPublicKey' };
      mockJwksClient.getSigningKey.mockImplementation((kid, callback) => {
        callback(null, mockKey as any);
      });

      const header = { kid: 'testKid', alg: 'RS256' };
      jwtService.getKey(header, (err, key) => {
        expect(err).toBeNull();
        expect(key).toBe('mockPublicKey');
        done();
      });
    });

    it('should handle errors from getSigningKey', done => {
      mockJwksClient.getSigningKey.mockImplementation((kid, callback) => {
        callback(new Error('Error fetching signing key'), undefined);
      });

      const header = { kid: 'testKid', alg: 'RS256' };
      jwtService.getKey(header, (err, key) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Error fetching signing key');
        expect(key).toBeUndefined();
        done();
      });
    });

    it('should throw an error if no KID is found in JWT', () => {
      const header = {}; // Missing 'kid'
      expect(() => {
        jwtService.getKey(header as any, jest.fn());
      }).toThrow('No KID found in JWT');
    });
  });
});
