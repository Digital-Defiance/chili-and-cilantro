import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../auth-provider';

interface FormValues {
  email: string;
  username: string;
  password: string;
}

const LoginPage = () => {
  const [loginType, setLoginType] = useState<'email' | 'username'>('email');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    } as FormValues,
    validationSchema: Yup.object({
      [loginType]:
        loginType === 'email'
          ? Yup.string().email('Invalid email address').required('Required')
          : Yup.string()
              .matches(constants.USERNAME_REGEX, constants.USERNAME_REGEX_ERROR)
              .required('Required'),
      password: Yup.string()
        .matches(constants.PASSWORD_REGEX, constants.PASSWORD_REGEX_ERROR)
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
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
        resetForm();
        navigate('/dashboard');
      } catch (error) {
        setLoginError('An unexpected error occurred');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResendVerification = async () => {
    try {
      await axios.post('/user/resend-verification', {
        [loginType]: formik.values[loginType],
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

  const formikRef = useRef(formik);
  formikRef.current = formik;

  useEffect(() => {
    const currentFormik = formikRef.current;
    currentFormik.setFieldValue(loginType, '');
    currentFormik.setFieldTouched(loginType, false);
  }, [loginType]);

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
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id={loginType}
            label={loginType === 'email' ? 'Email Address' : 'Username'}
            name={loginType}
            autoComplete={loginType === 'email' ? 'email' : 'username'}
            autoFocus
            value={formik.values[loginType]}
            onChange={formik.handleChange}
            error={
              formik.touched[loginType] && Boolean(formik.errors[loginType])
            }
            helperText={formik.touched[loginType] && formik.errors[loginType]}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          {loginError && (
            <Typography color="error" variant="body2">
              {loginError}
            </Typography>
          )}
          {resendStatus && (
            <Typography color="info" variant="body2">
              {resendStatus}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          {loginError === 'Account status is PendingEmailVerification' && (
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResendVerification}
              disabled={formik.isSubmitting}
              sx={{ mb: 2 }}
            >
              Resend Verification Email
            </Button>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <MuiLink
              component={Link}
              to="#"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                setLoginType(loginType === 'email' ? 'username' : 'email');
              }}
            >
              {`Use ${loginType === 'email' ? 'Username' : 'Email'}`}
            </MuiLink>
            <MuiLink component={Link} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
