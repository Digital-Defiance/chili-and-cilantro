import { StringNames } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppTranslation } from '../i18n-provider';

interface LocationState {
  errorMessage?: string;
}

const AccountError: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useAppTranslation();

  const errorMessage =
    (location.state as LocationState)?.errorMessage ||
    t(StringNames.AccountError_Message);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: theme.spacing(3),
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          {t(StringNames.AccountError_Title)}
        </Typography>
        <Typography variant="body1" align="center" sx={{ my: 2 }}>
          {errorMessage}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          {t(StringNames.Common_GoToSplash)}
        </Button>
      </Paper>
    </Box>
  );
};

export default AccountError;
