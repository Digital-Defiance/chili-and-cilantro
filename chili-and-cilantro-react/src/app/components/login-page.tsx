import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../auth-provider';

interface FormValues {
  email: string;
  username: string;
  password: string;
}

const LoginPage = () => {
  const [formKey, setFormKey] = useState(0);
  const [loginType, setLoginType] = useState<'email' | 'username'>('email');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const getInitialValues = (): FormValues => ({
    email: '',
    username: '',
    password: '',
  });

  const validationSchema = Yup.object({
    [loginType]:
      loginType === 'email'
        ? Yup.string().email('Invalid email address').required('Required')
        : Yup.string()
            .matches(constants.USERNAME_REGEX, constants.USERNAME_REGEX_ERROR)
            .required('Required'),
    password: Yup.string()
      .matches(constants.PASSWORD_REGEX, constants.PASSWORD_REGEX_ERROR)
      .required('Required'),
  });

  const handleSubmit = async (
    values: FormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    try {
      const loginResult = await login(
        loginType === 'email' ? values.email : values.username,
        values.password,
        loginType === 'email',
      );
      if ('error' in loginResult) {
        setLoginError(loginResult.error);
        return;
      }

      // Wait for a short time to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      resetForm();
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setLoginError(error.response.data.message);
        if (
          error.response.data.message ===
          'Account status is PendingEmailVerification'
        ) {
          setResendStatus(null);
        }
      } else {
        setLoginError('An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendVerification = async (identifier: string) => {
    try {
      await axios.post('/user/resend-verification', {
        [loginType]: identifier,
      });
      setResendStatus('Verification email sent successfully');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setResendStatus(error.response.data.message);
      } else {
        setResendStatus('Failed to resend verification email');
      }
    }
  };

  useEffect(() => {
    setFormKey((prevKey) => prevKey + 1);
  }, [loginType]);

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <Formik<FormValues>
        key={formKey}
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          isSubmitting,
          values,
          errors,
          touched,
        }: FormikProps<FormValues>) => (
          <Form className="auth-form">
            <div className="form-group">
              <label htmlFor={loginType}>
                {loginType === 'email' ? 'Email' : 'Username'}
              </label>
              <Field
                type={loginType === 'email' ? 'email' : 'text'}
                id={loginType}
                name={loginType}
                required
                aria-invalid={touched[loginType] && !!errors[loginType]}
              />
              <ErrorMessage
                name={loginType}
                component="div"
                className="error"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                required
                aria-invalid={touched.password && !!errors.password}
              />
              <ErrorMessage name="password" component="div" className="error" />
              {loginError && <div className="error">{loginError}</div>}
            </div>

            {resendStatus && <div className="info">{resendStatus}</div>}

            {loginError === 'Account status is PendingEmailVerification' && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleResendVerification(values[loginType])}
                disabled={isSubmitting || !values[loginType]}
              >
                {isSubmitting ? 'Sending...' : 'Resend Verification Email'}
              </button>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
      <div className="auth-links">
        <div className="toggle-login-type">
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              setLoginType(loginType === 'email' ? 'username' : 'email');
            }}
          >
            Switch to {loginType === 'email' ? 'Username' : 'Email'} Login
          </Link>
        </div>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/register" className="register-link">
            Don&apos;t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
