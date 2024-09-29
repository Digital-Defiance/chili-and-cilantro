import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7EDB0E', // green-chili
      dark: '#0E683C', // green-chili-shadow
      contrastText: '#FFFDD0', // background-color
    },
    secondary: {
      main: '#FF081F', // red-chili
      dark: '#9C0020', // red-chili-shadow
      contrastText: '#FFFDD0', // background-color
    },
    background: {
      default: '#FFFDD0', // background-color
      paper: '#FFFDD0',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: '#FFFDD0', // background-color for contrast
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Playfair Display", serif',
  },
});

export default theme;
