import React from 'react';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import { Link as RouterLink } from 'react-router-dom';

interface HeaderProps {
  brandName?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ brandName = 'Bella Napoli Pizzeria', children }) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255, 248, 238, 0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: 'rgba(178, 58, 72, 0.15)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'grid',
              placeItems: 'center',
            }}>
              <LocalPizzaIcon fontSize="small" />
            </Box>
            <Typography
              component={RouterLink}
              to="/"
              variant="h6"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 800,
              }}
            >
              {brandName}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={RouterLink} to="/" color="inherit">Home</Button>
            <Button component={RouterLink} to="/menu" color="inherit">Menu</Button>
            <Button component={RouterLink} to="/about" color="inherit">About</Button>
            <Button component={RouterLink} to="/contact" color="inherit">Contact</Button>
            <Button component={RouterLink} to="/contact" variant="contained" color="primary">
              Book a Table
            </Button>
          </Stack>
        </Toolbar>
      </Container>
      {children}
    </AppBar>
  );
};

export default Header;
