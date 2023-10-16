import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user === undefined) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.preferred_username}</p>
      <p>{user.sub}</p>
      <p>{user.email_verified ? 'verified' : 'not verified'}</p>
    </div>
  );
}

export default UserProfile;
