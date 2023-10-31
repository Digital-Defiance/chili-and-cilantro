import { environment } from './environment';
import { Server, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { JwksClient, SigningKey } from 'jwks-rsa';
import http from 'http';
import https from 'https';
import registerGameHandler from './socket-handlers/game';

export class SocketManager {
  private static instance: SocketManager;
  private io: Server;
  private socketsById: Map<string, Socket> = new Map();
  private jwksClient: JwksClient;

  constructor(server: http.Server | https.Server, jwksClient: JwksClient) {
    if (SocketManager.instance) {
      throw new Error("SocketManager can only be instantiated once.");
    }
    SocketManager.instance = this;
    this.jwksClient = jwksClient;
    this.io = new Server(server, {
      cors: {
        origin: environment.developer.corsOrigin,
        methods: ["GET", "POST"],
      },
    });

    this.setupAuthMiddleware();
    this.setupHandlers();
    this.handleErrorEvents();
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      throw new Error("SocketManager has not been instantiated.");
    }
    return SocketManager.instance;
  }

  private setupAuthMiddleware(): void {
    this.io.use((socket: Socket, next: (err?: any) => void) => {
      let token = socket.handshake.query.token;

      if (Array.isArray(token)) {
        if (token.length == 0) {
          return next(new Error('Authentication error'));
        }
        token = token[0];
      }


      verify(token, (header, callback) => {
        this.jwksClient.getSigningKey(
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
      }, {
        algorithms: ["RS256"]
      }, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        return next();
      });
    });
  }

  private setupHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const { id } = socket;
      this.socketsById.set(id, socket);

      registerGameHandler(this.io, socket);
    });
  }

  private handleErrorEvents(): void {
    this.io.engine.on("connection_error", (err) => {
      console.log(err.req);      // the request object
      console.log(err.code);     // the error code, for example 1
      console.log(err.message);  // the error message, for example "Session ID unknown"
      console.log(err.context);  // some additional error context
    });
  }

  public getSocketById(id: string): Socket | undefined {
    return this.socketsById.get(id);
  }

  public getClientInstance(): Server {
    return this.io;
  }
}

export function setupSockets(server: http.Server | https.Server): SocketManager {
  const client = new JwksClient({
    jwksUri: `https://${environment.auth0.domain}/.well-known/jwks.json`
  });
  return new SocketManager(server, client);
}
