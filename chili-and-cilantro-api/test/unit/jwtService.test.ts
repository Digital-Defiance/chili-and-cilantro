import { JwtService } from '../../src/services/jwt';
import { JwksClient, SigningKey } from 'jwks-rsa';
import { managementClient } from '../../src/auth0';
import { UserService } from '../../src/services/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { GetUsers200ResponseOneOfInner } from 'auth0';

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
jest.mock('../../src/services/user', () => ({
  UserService: jest.fn().mockImplementation(() => ({
    // Mock implementation or methods
  })),
}));
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn(),
}));

// jest.mock('jwks-rsa');
// jest.mock('../../src/auth0');
// jest.mock('../../src/services/user');

describe('JwtService', () => {
  let jwtService: JwtService;
  let mockRequest: { headers: { authorization?: string } };
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let nextFunction: jest.Mock;

  beforeEach(() => {
    jwtService = new JwtService();
    mockRequest = { headers: { authorization: 'Bearer token' } };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    (JwksClient as jest.Mock).mockClear();
    (UserService as jest.Mock).mockClear();
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

    // Add more test cases as needed
  });

  describe('authenticateUserAsync', () => {
    it('should authenticate user and call next function', async () => {
      // Mock the JWT verification process
      const mockDecodedToken: JwtPayload = { sub: 'user-id' };
      jest.spyOn(jwt, 'verify').mockImplementation((token: string, getKey: jwt.Secret | jwt.GetPublicKeyOrSecret, options: jwt.VerifyOptions | undefined, callback?: jwt.VerifyCallback<string | jwt.Jwt | jwt.JwtPayload> | undefined) => {
        if (callback) {
          callback(null, mockDecodedToken);
        }
      });

      // Mock the managementClient to return a successful response
      const mockAuth0User: GetUsers200ResponseOneOfInner = { user_id: 'user-id', name: 'Test User' } as any;
      (managementClient.users.get as jest.Mock).mockResolvedValue(mockAuth0User);

      // Set up mock request with authorization header
      mockRequest.headers.authorization = 'Bearer valid-token';

      // Call the authenticateUserAsync method
      await jwtService.authenticateUserAsync(mockRequest as any, mockResponse as any, nextFunction);

      // Assertions
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(Function), expect.any(Object), expect.any(Function));
      expect(managementClient.users.get).toHaveBeenCalledWith({ id: mockDecodedToken.sub });
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 401 for missing access token', async () => {
      // Test for missing token
    });

    // Add more test cases as needed
  });

  describe('getUserFromValidatedTokenAsync', () => {
    it('should fetch user from validated token', async () => {
      // Write test logic here
    });

    it('should throw an error for invalid token', async () => {
      // Test error handling
    });

    // Add more test cases as needed
  });

  // Add more tests for other methods and scenarios
});
