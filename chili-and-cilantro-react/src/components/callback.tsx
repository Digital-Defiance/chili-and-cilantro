import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetchedRef = useRef(false);
  const error = null;
  const isLoading = false;
  const isAuthenticated = false;
  const user = null;
  const getAccessTokenSilently = async () => {
    return '';
  };

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
  }, [isLoading, navigate, isAuthenticated, user, location, error]);

  return <div>Loading...</div>;
}

export default Callback;
