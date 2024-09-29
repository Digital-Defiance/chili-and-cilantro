import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { isAxiosError } from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../services/api';
import './auth.scss';

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

  const handleSubmit = async (values: FormValues) => {
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
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="auth-container">
      <h2 className="auth-title">
        {isTokenValid ? 'Reset Password' : 'Forgot Password'}
      </h2>
      <form className="auth-form" onSubmit={formik.handleSubmit}>
        {isTokenValid ? (
          <>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                {...formik.getFieldProps('password')}
              />
              {formik.errors.password && (
                <div className="error">{formik.errors.password}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                {...formik.getFieldProps('confirmPassword')}
              />
              {formik.errors.confirmPassword && (
                <div className="error">{formik.errors.confirmPassword}</div>
              )}
            </div>
          </>
        ) : (
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" {...formik.getFieldProps('email')} />
            {formik.errors.email && (
              <div className="error">{formik.errors.email}</div>
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {isTokenValid ? 'Reset Password' : 'Send Reset Email'}
        </button>
      </form>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default ForgotPasswordPage;
