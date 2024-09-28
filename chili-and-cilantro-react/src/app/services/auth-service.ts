// services/authService.js
import { IRequestUser } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { isAxiosError } from 'axios';
import api from './api';
import authenticatedApi from './authenticated-api';

const login = async (
  identifier: string,
  password: string,
  isEmail: boolean,
): Promise<{ token: string } | { error: string; status?: number }> => {
  try {
    const response = await api.post('/user/login', {
      [isEmail ? 'email' : 'username']: identifier,
      password,
    });
    if (response.data.token) {
      return { token: response.data.token };
    }
    return { error: 'Login failed: No token received' };
  } catch (error) {
    console.error('Login error:', error);
    if (isAxiosError(error) && error.response) {
      return {
        error: error.response.data.message || 'Login failed',
        status: error.response.status,
      };
    }
    return { error: 'An unexpected error occurred during login' };
  }
};

const register = async (
  username: string,
  email: string,
  password: string,
  timezone: string,
) => {
  const response = await api.post('/user/register', {
    username,
    email,
    password,
    timezone,
  });
  return response.data;
};

const changePassword = async (currentPassword: string, newPassword: string) => {
  // if we get a 200 response, the password was changed successfully
  // else, we throw an error with the response message
  const response = await authenticatedApi.post('/user/change-password', {
    currentPassword,
    newPassword,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(response.data.message || 'An unexpected error occurred');
  }
};
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
};

const verifyToken = async (token: string): Promise<IRequestUser> => {
  try {
    const response = await api.get('/user/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user as IRequestUser;
  } catch (error) {
    console.error('Token verification error:', error);
    if (isAxiosError(error) && error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw new Error('Invalid token');
  }
};

const refreshToken = async () => {
  // Refresh the token to update roles
  try {
    const refreshResponse = await authenticatedApi.get('/user/refresh-token');
    if (refreshResponse.status === 200) {
      const newToken = refreshResponse.headers['authorization'];
      if (newToken?.startsWith('Bearer ')) {
        const token = newToken.slice(7); // Remove 'Bearer ' prefix
        // Update the stored authToken
        localStorage.setItem('authToken', token);
      }
      if (refreshResponse.data.user) {
        localStorage.setItem('user', JSON.stringify(refreshResponse.data.user));
      }
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    if (isAxiosError(error) && error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw new Error('An unexpected error occurred during token refresh');
  }
};

export default {
  changePassword,
  login,
  register,
  logout,
  verifyToken,
  refreshToken,
};
