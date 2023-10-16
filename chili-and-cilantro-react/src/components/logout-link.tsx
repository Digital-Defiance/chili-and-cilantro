import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './logout-link.scss';

function LogoutLink() {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout()} className="logout-link">
      Log Out
    </button>
  );
}

export default LogoutLink;
