import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#78bf33', // new-lightGreen
      dark: '#375c4b', // new-green
      light: '#7edb0e', // green-chili
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#cc2129', // new-red
      dark: '#9c0020', // red-chili-shadow
      light: '#ff081f', // red-chili
      contrastText: '#ffffff',
    },
    background: {
      default: '#05070b', // new-dark
      paper: '#1a1e24', // slightly lighter than new-dark for contrast
    },
    text: {
      primary: '#ffffff',
      secondary: '#cfcdc8', // new-gray
    },
    error: {
      main: '#cc2129', // new-red
    },
    warning: {
      main: '#e3fe2d', // cilantro-light
    },
    info: {
      main: '#24b215', // cilantro-dark
    },
    success: {
      main: '#78bf33', // new-lightGreen
    },
  },
  typography: {
    fontFamily: '"Playfair Display", serif',
    h1: {
      fontFamily: '"McFoodPoisoning", sans-serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"McFoodPoisoning", sans-serif',
      fontWeight: 500,
    },
    h3: {
      fontWeight: 400,
    },
    button: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: '#cfcdc8', // new-gray
          color: '#05070b', // new-dark
          '&:hover': {
            backgroundColor: '#cc2129', // new-red
          },
        },
        containedSecondary: {
          backgroundColor: '#cfcdc8', // new-gray
          color: '#05070b', // new-dark
          '&:hover': {
            backgroundColor: '#375c4b', // new-green
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#cfcdc8', // new-gray
            },
            '&:hover fieldset': {
              borderColor: '#78bf33', // new-lightGreen
            },
            '&.Mui-focused fieldset': {
              borderColor: '#78bf33', // new-lightGreen
            },
          },
        },
      },
    },
  },
});

export default theme;
