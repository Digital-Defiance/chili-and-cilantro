// custom.d.ts
import 'socket.io';

// Extend the Socket interface with additional properties
declare module 'socket.io' {
  interface Socket {
    decoded?: any;
    userId: string;
    playerId: string;
  }
}
