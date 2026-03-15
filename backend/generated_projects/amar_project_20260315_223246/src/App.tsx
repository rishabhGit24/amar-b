import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B23A48',
      light: '#D97A85',
      dark: '#7B1E2B',
      contrastText: '#FFF8EE',
    },
    secondary: {
      main: '#D9961A',
      light: '#F2C35B',
      dark: '#A56D00',
      contrastText: '#1D1A18',
    },
    background: {
      default: '#FFF8EE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2A211D',
      secondary: '#5E4A3F',
    },
    success: {
      main: '#2E8B57',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 18px 40px rgba(95, 48, 37, 0.12)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
