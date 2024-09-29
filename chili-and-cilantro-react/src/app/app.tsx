// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApiAccess from '../components/api-access';
import Callback from '../components/callback';
import Game from '../components/game';
import LoginLink from '../components/login-link';
import LogoutLink from '../components/logout-link';
import AccountError from '../pages/account-error';
import Register from '../pages/register';
import SplashPage from '../pages/splash-page';

import { Link, Route, Routes } from 'react-router-dom';

export function App() {
  const isAuthenticated = false; // Replace with actual authentication logic
  return (
    <div>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
          {!isAuthenticated && (
            <li>
              <Link to="/register">Register</Link>
            </li>
          )}
          {!isAuthenticated && (
            <li>
              <LoginLink />
            </li>
          )}
          {isAuthenticated && (
            <li>
              <Link to="/game">Game</Link>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <LogoutLink />
            </li>
          )}
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/api-access" element={<ApiAccess />} />
        <Route path="/game" element={<Game />} />
        <Route path="/account-error" element={<AccountError />} />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
