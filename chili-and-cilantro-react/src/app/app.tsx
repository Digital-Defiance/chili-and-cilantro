import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import '../styles.scss';
import theme from '../theme';
import { AuthProvider } from './auth-provider';
import ApiAccess from './components/api-access';
import ChangePasswordPage from './components/change-password-page';
import DashboardPage from './components/dashboard-page';
import ForgotPasswordPage from './components/forgot-password-page';
import Game from './components/game';
import LoginPage from './components/login-page';
import PrivateRoute from './components/private-route';
import RegisterPage from './components/register-page';
import SplashPage from './components/splash-page';
import TopMenu from './components/top-menu';
import TranslatedTitle from './components/translated-title';
import VerifyEmailPage from './components/verify-email-page';
import { TranslationProvider } from './i18n-provider';
import { MenuProvider } from './menu-context';
import { UserProvider } from './user-context';

const App: FC = () => {
  return (
    <TranslationProvider>
      <TranslatedTitle />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <UserProvider>
            <InnerApp />
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </TranslationProvider>
  );
};

const InnerApp: FC = () => {
  return (
    <MenuProvider>
      <Container className="app-container" sx={{ paddingTop: '64px' }}>
        <TopMenu />
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route
            path="/api-access"
            element={
              <PrivateRoute>
                <ApiAccess />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePasswordPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/game"
            element={
              <PrivateRoute>
                <Game />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </Container>
    </MenuProvider>
  );
};

export default App;
