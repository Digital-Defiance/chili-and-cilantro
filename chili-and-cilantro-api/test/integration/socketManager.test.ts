import { createServer, Server as HttpServer } from 'http';
import { setupSockets, SocketManager } from '../../src/socketManager';
import { io as Client, Socket } from 'socket.io-client';
import jwt from 'jsonwebtoken';

describe('SocketManager', () => {
  let httpServer: HttpServer;
  let ioServer: SocketManager;
  let clientSocket: Socket;

  beforeAll((done) => {
    httpServer = createServer();
    ioServer = setupSockets(httpServer);
    httpServer.listen(() => {
      const addressInfo = httpServer.address();
      if (typeof addressInfo === 'string') {
        throw new Error(`Invalid addressInfo: ${addressInfo}`);
      } else if (addressInfo === null) {
        throw new Error('Invalid addressInfo: null');
      }
      const port = addressInfo.port;
      clientSocket = Client(`http://localhost:${port}`, {
        reconnectionDelay: 0,
        reconnectionDelayMax: 0,
        forceNew: true, // Instead of 'force new connection'
        transports: ['websocket'],
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll((done) => {
    ioServer.getClientInstance().close();
    clientSocket.close();
    httpServer.close(done);
  });

  test('should authenticate valid tokens', (done) => {
    // Mock the jwksClient and token verification here

    // Emit an event that requires authentication
    clientSocket.emit('authenticated_event', { token: 'valid_token' });

    // Assert that the event is handled correctly
    clientSocket.on('event_response', (data) => {
      expect(data).toBe('expected_response');
      done();
    });
  });

  test('should reject invalid tokens', (done) => {
    // Mock the jwksClient and token verification to fail

    // Emit an event that requires authentication
    clientSocket.emit('authenticated_event', { token: 'invalid_token' });

    // Assert that the error is handled correctly
    clientSocket.on('error', (error) => {
      expect(error).toBe('Authentication error');
      done();
    });
  });

  // Add more tests here
});
