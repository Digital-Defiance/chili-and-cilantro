import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Button, styled, TextField, Typography } from '@mui/material';
import { useAuth } from '../auth-provider';

const ApiAccessContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
}));

const ApiAccessContent = styled(Box)(({ theme }) => ({
  maxWidth: '600px',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  boxShadow: theme.shadows[3],
}));

const ApiAccessTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

function ApiAccess() {
  const { token } = useAuth();

  const copyToClipboard = async () => {
    if (token) {
      try {
        await navigator.clipboard.writeText(token);
        alert('Token copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <ApiAccessContainer>
      <ApiAccessContent>
        <ApiAccessTitle variant="h4" align="center">
          Your Access Token
        </ApiAccessTitle>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={token || 'Token not available'}
          inputProps={{
            readOnly: true,
          }}
          variant="outlined"
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<ContentCopyIcon />}
          onClick={copyToClipboard}
          fullWidth
          style={{ marginTop: '16px' }}
        >
          Copy to Clipboard
        </Button>
      </ApiAccessContent>
    </ApiAccessContainer>
  );
}

export default ApiAccess;
