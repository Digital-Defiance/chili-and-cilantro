import { Server, Socket } from 'socket.io';
import { GameService } from '../services/gameService';
import { Database } from '../services/database';
import { SocketManager } from '../socketManager';

export default (io: Server, socket: Socket) => {
  const lobbies = new Map<string, Set<string>>();
  const socketsByGameCode: Map<string, Set<Socket>> = new Map();
  const gameService = new GameService(new Database(), SocketManager.getInstance());

  socket.on('lobby:join', async (gameCode, password) => {
    try {
      const game = await gameService.getGameByCode(gameCode);

      if (game.password && game.password !== password) {
        return socket.emit('lobby:join:failed', { message: 'Invalid password' });
      }

      if (!lobbies.has(gameCode)) {
        lobbies.set(gameCode, new Set());
      }

      if (!socketsByGameCode.has(gameCode)) {
        socketsByGameCode.set(gameCode, new Set());
      }
      const sockets = socketsByGameCode.get(gameCode);
      if (!sockets) {
        throw new Error('unexpected missing socketsByGameCode set');
      }
      sockets.add(socket);

      const players = lobbies.get(gameCode);

      if (!players) {
        return socket.emit('lobby:join:failed', { message: 'Game not found' });
      } else if (players.has(socket.id)) {
        return socket.emit('lobby:join:failed', { message: 'You are already in this lobby' });
      } else {
        players.add(socket.id);
        socket.join(gameCode);
        io.to(gameCode).emit('player:join', { socketId: socket.id });
        socket.emit('lobby:join:success');
      }
    } catch (error) {
      console.error('Error joining lobby:', error);
      socket.emit('lobby:join:failed', { message: 'Internal server error' });
    }
  });

  socket.on('disconnect', () => {
    for (const [lobbyId, players] of lobbies.entries()) {
      if (players.has(socket.id)) {
        players.delete(socket.id);
        if (players.size === 0) {
          lobbies.delete(lobbyId);
        }
        break;
      }
    }
    for (const [gameCode, sockets] of socketsByGameCode.entries()) {
      if (sockets.has(socket)) {
        sockets.delete(socket);
        if (sockets.size === 0) {
          socketsByGameCode.delete(gameCode);
        }
      }
    }
  });
}
