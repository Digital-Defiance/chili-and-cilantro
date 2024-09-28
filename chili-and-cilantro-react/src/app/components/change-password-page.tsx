import {
  constants,
  StringNames,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { FC, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from '../auth-provider';
import { useAppTranslation } from '../i18n-provider';

const ChangePasswordPage: FC = () => {
  const { isAuthenticated, user, loading, changePassword } =
    useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useAppTranslation();

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .matches(
        constants.PASSWORD_REGEX,
        t(StringNames.Validation_PasswordRegexError),
      )
      .required(t(StringNames.Validation_CurrentPasswordRequired)),
    newPassword: Yup.string()
      .matches(
        constants.PASSWORD_REGEX,
        t(StringNames.Validation_PasswordRegexError),
      )
      .notOneOf(
        [Yup.ref('currentPassword')],
        t(StringNames.Validation_PasswordsDifferent),
      )
      .required(t(StringNames.Validation_NewPasswordRequired)),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], t(StringNames.Validation_PasswordMatch))
      .required(t(StringNames.Validation_ConfirmNewPassword)),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const result = await changePassword(
          values.currentPassword,
          values.newPassword,
        );
        if (result.success) {
          setSuccessMessage(result.message);
          setErrorMessage(null);
          resetForm();
        }
      } catch (err) {
        console.error('Error changing password:', err);
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage(t(StringNames.Common_UnexpectedError));
        }
        setSuccessMessage(null);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <Typography>{t(StringNames.Common_Loading)}...</Typography>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {t(StringNames.Common_ChangePassword)}
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label={t(StringNames.Common_CurrentPassword)}
            type="password"
            id="currentPassword"
            autoComplete="current-password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.currentPassword &&
              Boolean(formik.errors.currentPassword)
            }
            helperText={
              formik.touched.currentPassword && formik.errors.currentPassword
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label={t(StringNames.Common_NewPassword)}
            type="password"
            id="newPassword"
            autoComplete="new-password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label={t(StringNames.Common_ConfirmNewPassword)}
            type="password"
            id="confirmNewPassword"
            autoComplete="new-password"
            value={formik.values.confirmNewPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmNewPassword &&
              Boolean(formik.errors.confirmNewPassword)
            }
            helperText={
              formik.touched.confirmNewPassword &&
              formik.errors.confirmNewPassword
            }
          />
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {t(StringNames.ChangePassword_ChangePasswordButton)}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ChangePasswordPage;
