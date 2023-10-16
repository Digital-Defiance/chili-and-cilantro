import React from 'react';
import { useLocation } from 'react-router-dom';

interface LocationState {
  errorMessage?: string;
}

const AccountError: React.FC = () => {
  const location = useLocation();

  const errorMessage =
    (location.state as LocationState)?.errorMessage ||
    'There seems to be an issue with your account. Please contact support.';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f7f7f7',
      }}
    >
      <div
        style={{
          border: '1px solid #e0e0e0',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ color: '#d9534f' }}>Account Error</h2>
        <p style={{ textAlign: 'center', margin: '20px 0' }}>{errorMessage}</p>
        <button
          onClick={() => (window.location.href = '/')}
          style={{
            padding: '10px 15px',
            backgroundColor: '#d9534f',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default AccountError;
