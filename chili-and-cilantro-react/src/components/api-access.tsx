import { useEffect, useState } from 'react';

function ApiAccess() {
  const getAccessTokenSilently = async () => {
    return '';
  };
  const isLoading = false;
  const error: { message: string } | null = null;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      getAccessTokenSilently()
        .then((accessToken) => {
          setToken(accessToken);
        })
        .catch((err) => {
          console.error('Error getting the access token:', err);
        });
    }
  }, [isLoading, getAccessTokenSilently]);

  const copyToClipboard = async () => {
    if (token) {
      try {
        await navigator.clipboard.writeText(token);
        alert('Token copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (error !== null) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <div>
      <h1>Your Access Token:</h1>
      <textarea
        readOnly
        value={token || 'Token not available'}
        style={{ width: '100%', height: '150px' }}
      ></textarea>
      <button onClick={copyToClipboard}>Copy to Clipboard</button>
    </div>
  );
}

export default ApiAccess;
