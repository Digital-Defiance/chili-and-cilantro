// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useAuth0 } from '@auth0/auth0-react';
import { AuthenticationGuard } from '../components/authentication-required';
import styles from './app.module.scss';
import AccountError from '../pages/account-error';
import ApiAccess from '../components/api-access';
import Callback from '../components/callback';
import LoginLink from '../components/login-link';
import LogoutLink from '../components/logout-link';
import Register from '../pages/register';
import UserProfile from '../pages/user-profile';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  const { isAuthenticated } = useAuth0();
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
              <Link to="/profile">Profile</Link>
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
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route path="/callback" element={<Callback />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <div>
              <AuthenticationGuard component={UserProfile} />
            </div>
          }
        />
        <Route
          path="/api-access"
          element={
            <div>
              <AuthenticationGuard component={ApiAccess} />
            </div>
          }
        />
        <Route path="/account-error" element={<AccountError />} />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
