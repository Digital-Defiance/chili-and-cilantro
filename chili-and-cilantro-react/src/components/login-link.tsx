import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './login-link.scss';

function LoginLink() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button onClick={() => loginWithRedirect()} className="login-link">
      Log In
    </button>
  );
}

export default LoginLink;
