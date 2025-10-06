import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#FCF9EA',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#BADFDB',
      dark: '#8FBFBE',
      light: '#D8EEF0',
      contrastText: '#3E3E3E',
    },
    secondary: {
      main: '#FF6F61',
      dark: '#E25D52',
      light: '#FFA79F',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E05A5A',
      dark: '#C44A4A',
      light: '#F28E8E',
    },
    warning: {
      main: '#FFBDBD',
    },
    text: {
      primary: '#3E3E3E',
      secondary: '#6B6B6B',
      disabled: '#9A9A9A',
    },
    divider: 'rgba(62,62,62,0.12)',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6AA6A0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6AA6A0',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4E837E',
            borderWidth: 2,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#6AA6A0',
          '&.Mui-focused': {
            color: '#4E837E',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          color: '#4E837E',
          borderColor: '#4E837E',
          '&:hover': {
            borderColor: '#3A6B68',
            backgroundColor: 'rgba(78,131,126,0.08)',
          },
        },
        outlinedError: {
          color: '#C44A4A',
          borderColor: '#C44A4A',
          '&:hover': {
            borderColor: '#A53B3B',
            backgroundColor: 'rgba(196,74,74,0.08)',
          },
        },
      },
    },
  },
});

export default theme;