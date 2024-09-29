import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { isAxiosError } from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../services/api';

type FormValues = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const ForgotPasswordPage: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      (async () => {
        await validateToken(token);
      })();
    }
  }, [location]);

  const validateToken = async (token: string) => {
    try {
      await api.get(`/user/verify-reset-token?token=${token}`);
      setIsTokenValid(true);
    } catch {
      setIsTokenValid(false);
      setErrorMessage(
        'Invalid or expired token. Please request a new password reset.',
      );
    }
  };

  const initialValues: FormValues = isTokenValid
    ? { password: '', confirmPassword: '' }
    : { email: '' };

  const validationSchema = isTokenValid
    ? Yup.object({
        password: Yup.string()
          .matches(constants.PASSWORD_REGEX, constants.PASSWORD_REGEX_ERROR)
          .required('Required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Required'),
      })
    : Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
      });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.email) {
          // Handle forgot password
          const response = await api.post('/user/forgot-password', {
            email: values.email,
          });
          if (response.status === 200) {
            setSuccessMessage(response.data.message);
            setErrorMessage('');
          } else {
            setErrorMessage(response.data.message);
            setSuccessMessage('');
          }
        } else if (values.password && values.confirmPassword) {
          // Handle password reset
          const params = new URLSearchParams(location.search);
          const token = params.get('token');
          if (!token) {
            setErrorMessage(
              'Invalid token. Please try the password reset process again.',
            );
            return;
          }
          const response = await api.post('/user/reset-password', {
            token,
            password: values.password,
          });
          if (response.status === 200) {
            setSuccessMessage(
              'Your password has been successfully reset. You can now log in with your new password.',
            );
            setErrorMessage('');
            setTimeout(() => navigate('/login'), 3000);
          } else {
            setErrorMessage(response.data.message);
            setSuccessMessage('');
          }
        }
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          setErrorMessage(
            error.response.data.message ||
              'An error occurred while processing your request.',
          );
          setSuccessMessage('');
        } else {
          setErrorMessage('An unexpected error occurred');
          setSuccessMessage('');
        }
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {isTokenValid ? 'Reset Password' : 'Forgot Password'}
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          {isTokenValid ? (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              />
            </>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isTokenValid ? 'Reset Password' : 'Send Reset Email'}
          </Button>
        </Box>
        {successMessage && (
          <Typography color="success.main" variant="body2">
            {successMessage}
          </Typography>
        )}
        {errorMessage && (
          <Typography color="error.main" variant="body2">
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
