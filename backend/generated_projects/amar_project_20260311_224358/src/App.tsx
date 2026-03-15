import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import VisitUsPage from './pages/VisitUsPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#a5b4fc',
      dark: '#4c51bf',
    },
    secondary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '3.5rem', fontWeight: 700 },
    h2: { fontSize: '2.5rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
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
          <Route path="/visit" element={<VisitUsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
