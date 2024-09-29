import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { isAxiosError } from 'axios';
import { FormikHelpers, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from '../auth-provider';
import authService from '../services/auth-service';
import './auth.scss';

interface FormValues {
  username: string;
  email: string;
  password: string;
  timezone: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = React.useContext(AuthContext);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );
  const [registrationSuccess, setRegistrationSuccess] =
    useState<boolean>(false);
  const [userTimezone, setUserTimezone] = useState<string>('');

  useEffect(() => {
    // Get the user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      timezone: userTimezone,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(constants.USERNAME_REGEX, constants.USERNAME_REGEX_ERROR)
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .matches(constants.PASSWORD_REGEX, constants.PASSWORD_REGEX_ERROR)
        .required('Required'),
      timezone: Yup.string().required('Timezone is required'),
    }),
    onSubmit: async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
      try {
        await authService.register(
          values.username,
          values.email,
          values.password,
          values.timezone,
        );
        setRegistrationError(null);
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: unknown) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
          setRegistrationError(
            error.response.data?.message ||
              'An error occurred during registration. Please try again.',
          );
        } else {
          setRegistrationError(
            'An unexpected error occurred. Please try again.',
          );
        }
        setRegistrationSuccess(false);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">Register</h2>
      {registrationSuccess && (
        <div className="success-message">
          Registration successful! You will be redirected to the login page
          shortly.
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="error">{formik.errors.username}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}
        </div>

        {registrationError && (
          <div className="error-message">{registrationError}</div>
        )}

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
