import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7EDB0E', // green-chili
      dark: '#0E683C', // green-chili-shadow
      contrastText: '#FFFFFF', // white for better contrast
    },
    secondary: {
      main: '#FF081F', // red-chili
      dark: '#9C0020', // red-chili-shadow
      contrastText: '#FFFFFF', // white for better contrast
    },
    background: {
      default: '#FFFFFF', // white background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#7EDB0E', // green-chili for AppBar
          color: '#FFFFFF', // white text for contrast
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#7EDB0E', // green-chili for buttons
          color: '#FFFFFF', // white text for contrast
          '&:hover': {
            backgroundColor: '#0E683C', // darker green on hover
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#333333', // darker text for better readability
        },
      },
    },
  },
  typography: {
    fontFamily: '"Playfair Display", serif',
  },
});

export default theme;
