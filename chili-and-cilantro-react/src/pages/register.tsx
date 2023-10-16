import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null); // holds either success or error messages
  const [isError, setIsError] = useState<boolean>(false); // to distinguish between success and error

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setMessage("Passwords don't match");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await axios.post('/api/users/register', formData);

      if (response.status === 201) {
        // Registration was successful
        setMessage("Registration successful! Please check your email for a verification link.");
        setIsError(false);
      }
    } catch (error: any) {
      // Handle errors from the server
      if (error.response && error.response.status === 400) {
        // Assuming the server responds with a message in case of an error
        setMessage(error.response.data.message || 'An error occurred during registration.');
        setIsError(true);
      } else {
        setMessage('An unexpected error occurred. Please try again later.');
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Registration Form</h2>
      {/* Display a message if it exists (whether it's an error or success) */}
      {message && (
        <div style={{color: isError ? 'red' : 'green'}}>{message}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} required />
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
