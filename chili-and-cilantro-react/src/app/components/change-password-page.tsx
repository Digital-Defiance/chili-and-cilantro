import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from '../auth-provider';
import './auth.scss';

const ChangePasswordPage: React.FC = () => {
  const { isAuthenticated, user, loading, error, changePassword } =
    useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .matches(constants.PASSWORD_REGEX, constants.PASSWORD_REGEX_ERROR)
      .required('Current password is required'),
    newPassword: Yup.string()
      .matches(constants.PASSWORD_REGEX, constants.PASSWORD_REGEX_ERROR)
      .notOneOf(
        [Yup.ref('currentPassword')],
        'New password must be different from the current password',
      )
      .required('New password is required'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Please confirm your new password'),
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
          setErrorMessage('An unexpected error occurred');
        }
        setSuccessMessage(null);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">Change Password</h2>
      <form onSubmit={formik.handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.currentPassword}
          />
          {formik.touched.currentPassword && formik.errors.currentPassword ? (
            <div className="error">{formik.errors.currentPassword}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="error">{formik.errors.newPassword}</div>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmNewPassword}
          />
          {formik.touched.confirmNewPassword &&
          formik.errors.confirmNewPassword ? (
            <div className="error">{formik.errors.confirmNewPassword}</div>
          ) : null}
        </div>

        {(error || errorMessage) && (
          <div className="error-message">{error || errorMessage}</div>
        )}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
