import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetchedRef = useRef(false);
  const { isLoading, error, user, isAuthenticated, getAccessTokenSilently } =
    useAuth0();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlError = queryParams.get('error');
    const errorDescription = queryParams.get('error_description');

    if (urlError) {
      navigate('/account-error', {
        state: { errorMessage: errorDescription || urlError },
      });
      return;
    }

    if (error) {
      navigate('/account-error', { state: { errorMessage: error } });
      return;
    }

    if (!isLoading && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getAccessTokenSilently()
        .then((accessToken) => {
          fetch('/api/users/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + accessToken,
            },
          }).then((response) => {
            if (response.ok) {
              navigate('/');
            } else {
              navigate('/account-error', {
                state: { errorMessage: response.statusText },
              });
            }
          });
        })
        .catch((fetchError) => {
          navigate('/account-error', {
            state: { errorMessage: fetchError.message || 'An error occurred' },
          });
        });
    }
  }, [
    getAccessTokenSilently,
    isLoading,
    navigate,
    isAuthenticated,
    user,
    location,
    error,
  ]);

  return <div>Loading...</div>;
}

export default Callback;
