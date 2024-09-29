import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import './verify-email-page.scss';

const VerifyEmailPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenFromQuery = query.get('token');

    if (tokenFromQuery) {
      (async () => {
        await verifyEmail(tokenFromQuery);
      })();
    } else {
      setLoading(false);
      setMessage('No verification token provided.');
      setVerificationStatus('error');
    }
  }, [location]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await api.get(`/user/verify-email?token=${token}`);
      if (response.status === 200) {
        setMessage('Email verified successfully!');
        setVerificationStatus('success');
      } else {
        setMessage('Email verification failed. Please try again.');
        setVerificationStatus('error');
      }
    } catch {
      setMessage(
        'An error occurred during email verification. Please try again.',
      );
      setVerificationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="verification-container">Verifying email...</div>;
  }

  return (
    <div className="verification-container">
      <h2 className="verification-title">Email Verification</h2>
      <p className={`verification-message ${verificationStatus}`}>{message}</p>
      {verificationStatus === 'success' && (
        <div className="verification-action">
          <Link to="/login">Proceed to Login</Link>
        </div>
      )}
      {verificationStatus === 'error' && (
        <div className="verification-action">
          <Link to="/">Return to Home</Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
