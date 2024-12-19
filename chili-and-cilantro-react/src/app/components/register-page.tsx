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
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAppTranslation } from '../i18n-provider';
import authService from '../services/auth-service';
import MultilineHelperText from './multi-line-helper-text';

interface FormValues {
  username: string;
  displayname: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const formik = useFormik<FormValues>({
    initialValues: {
      username: '',
      displayname: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .matches(
          constants.USERNAME_REGEX,
          t(StringNames.Validation_UsernameRegexErrorTemplate),
        )
        .required(t(StringNames.Validation_Required)),
      displayname: Yup.string()
        .matches(
          constants.USER_DISPLAY_NAME_REGEX,
          constants.USER_DISPLAY_NAME_REGEX_ERROR,
        )
        .required(t(StringNames.Validation_Required)),
      email: Yup.string()
        .email(t(StringNames.Validation_InvalidEmail))
        .required(t(StringNames.Validation_Required)),
      password: Yup.string()
        .matches(
          constants.PASSWORD_REGEX,
          t(StringNames.Validation_PasswordRegexErrorTemplate),
        )
        .required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        await authService.register(
          values.username,
          values.displayname,
          values.email,
          values.password,
          timezone,
        );
        setRegistrationError(null);
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setRegistrationError(
            error.response?.data.message ??
              error.message ??
              t(StringNames.Common_UnexpectedError),
          );
        } else if (error instanceof Error) {
          setRegistrationError(
            error.message || t(StringNames.Common_UnexpectedError),
          );
        } else {
          setRegistrationError(t(StringNames.Common_UnexpectedError));
        }
        setRegistrationSuccess(false);
      } finally {
        setSubmitting(false);
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
          Register
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
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="displayname"
            label="Display Name"
            name="displayname"
            autoComplete="displayname"
            autoFocus
            value={formik.values.displayname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.displayname && Boolean(formik.errors.displayname)
            }
            helperText={formik.touched.displayname && formik.errors.displayname}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={
              formik.touched.password && (
                <MultilineHelperText text={formik.errors.password as string} />
              )
            }
          />
          {registrationError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {registrationError}
            </Typography>
          )}
          {registrationSuccess && (
            <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
              Registration successful! Redirecting to login page...
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Registering...' : 'Register'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              Already have an account? Sign in
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
