import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import api from '../services/api';

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
      verifyEmail(tokenFromQuery);
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
    } catch (error) {
      setMessage(
        'An error occurred during email verification. Please try again.',
      );
      setVerificationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Email Verification
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography
              variant="body1"
              color={
                verificationStatus === 'success' ? 'success.main' : 'error.main'
              }
              gutterBottom
            >
              {message}
            </Typography>
            {verificationStatus === 'success' && (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Proceed to Login
              </Button>
            )}
            {verificationStatus === 'error' && (
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Return to Home
              </Button>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;
