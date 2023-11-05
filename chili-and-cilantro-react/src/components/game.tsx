import { useState, useEffect } from 'react';
import { IdToken, useAuth0 } from '@auth0/auth0-react';
import { environment } from '../environments/environment.prod';
// import { connect, Socket } from 'socket.io-client';

function GameComponent() {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();
  const [mode, setMode] = useState<'CREATE' | 'JOIN' | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [gameName, setGameName] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [gamePassword, setGamePassword] = useState<string>('');
  const [gameCode, setGameCode] = useState<string>('');
  //const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then((claims: IdToken | undefined) => {
        if (claims === undefined) {
          return;
        }
        const idToken = claims.__raw;
        setToken(idToken);
        //connectToSocket(idToken);
      });
    }
  }, [isAuthenticated]);

  // const connectToSocket = (token: string) => {
  //   const socketInstance = connect(environment.game.socketHost, {
  //     query: { token },
  //   });
  //   setSocket(socketInstance);
  // };

  const handleGameResponse = async (response: Response) => {
    if (response.ok) {
      const data = await response.json();
      const gameId = data.gameId;
      // if (socket) {
      //   socket.emit('lobby:join', gameId);
      // }
    }
  };

  const createGame = async () => {
    const response = await fetch(`${environment.game.apiUrl}/games/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: gameName,
        password: gamePassword,
        displayName,
      }),
    });
    handleGameResponse(response);
  };

  const joinGame = async () => {
    const response = await fetch(`${environment.game.apiUrl}/games/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code: gameCode,
        password: gamePassword,
        displayName,
      }),
    });
    handleGameResponse(response);
  };

  return (
    <div>
      <button onClick={() => setMode('CREATE')}>Create Game</button>
      <button onClick={() => setMode('JOIN')}>Join Game</button>

      {mode === 'CREATE' && (
        <div>
          <input
            placeholder="Game Name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>
      )}

      {mode && (
        <div>
          <input
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          {mode === 'JOIN' && (
            <input
              placeholder="Game Code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
            />
          )}

          <input
            placeholder="Game Password (optional)"
            type="password"
            value={gamePassword}
            onChange={(e) => setGamePassword(e.target.value)}
          />

          <button onClick={mode === 'CREATE' ? createGame : joinGame}>
            {mode === 'CREATE' ? 'Create' : 'Join'}
          </button>
        </div>
      )}
    </div>
  );
}

export default GameComponent;
