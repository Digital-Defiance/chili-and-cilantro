import {
  constants,
  StringNames,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { isAxiosError } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../auth-provider';
import { useAppTranslation } from '../i18n-provider';
import api from '../services/api';
import MultilineHelperText from './multi-line-helper-text';

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
  const { login, errorType, user } = useAuth();
  const { t } = useAppTranslation();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    } as FormValues,
    validationSchema: Yup.object({
      [loginType]:
        loginType === 'email'
          ? Yup.string()
              .email(t(StringNames.Validation_InvalidEmail))
              .required(t(StringNames.Validation_Required))
          : Yup.string()
              .matches(
                constants.USERNAME_REGEX,
                t(StringNames.Validation_UsernameRegexErrorTemplate),
              )
              .required(t(StringNames.Validation_Required)),
      password: Yup.string()
        .matches(
          constants.PASSWORD_REGEX,
          t(StringNames.Validation_PasswordRegexErrorTemplate),
        )
        .required(t(StringNames.Validation_Required)),
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
        setLoginError(t(StringNames.Common_UnexpectedError));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResendVerification = async () => {
    try {
      await api.post('/user/resend-verification', {
        [loginType]: formik.values[loginType],
      });
      setResendStatus(t(StringNames.Login_ResentPasswordSuccess));
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setResendStatus(error.response.data.message);
      } else {
        setResendStatus(t(StringNames.Login_ResentPasswordFailure));
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

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
          {t(StringNames.Login_Title)}
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
            label={
              loginType === 'email'
                ? t(StringNames.Common_Email)
                : t(StringNames.Common_Username)
            }
            name={loginType}
            autoComplete={loginType === 'email' ? 'email' : 'username'}
            autoFocus
            value={formik.values[loginType]}
            onChange={formik.handleChange}
            error={
              formik.touched[loginType] && Boolean(formik.errors[loginType])
            }
            helperText={
              formik.touched[loginType] && (
                <MultilineHelperText
                  text={formik.errors[loginType] as string}
                />
              )
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t(StringNames.Common_Password)}
            type="password"
            id="password"
            autoComplete="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={
              formik.touched.password && (
                <MultilineHelperText text={formik.errors.password as string} />
              )
            }
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
            {formik.isSubmitting
              ? t(StringNames.Login_Progress)
              : t(StringNames.Login_LoginButton)}
          </Button>
          {errorType === 'PendingEmailVerification' && (
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResendVerification}
              disabled={formik.isSubmitting}
              sx={{ mb: 2 }}
            >
              {t(StringNames.Login_ResendPasswordLink)}
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
              {loginType === 'email'
                ? t(StringNames.Login_UseUsername)
                : t(StringNames.Login_UseEmail)}
            </MuiLink>
            <MuiLink component={Link} to="/register" variant="body2">
              {t(StringNames.Login_NoAccountSignUp)}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
