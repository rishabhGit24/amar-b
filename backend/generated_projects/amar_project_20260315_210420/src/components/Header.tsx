import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "AMAR Platform" }) => {
  return (
    <AppBar position="static" sx={{
      backgroundColor: 'primary.dark',
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
      py: { xs: 0.5, md: 1 }
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{
          minHeight: { xs: 56, md: 64 },
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 1, sm: 2, md: 3 }
        }}>
          {/* Left section: Menu Icon (mobile) and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="start"
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: '.05rem',
                color: 'inherit',
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 },
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Middle section: Navigation Links (desktop) */}
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}
          >
            <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>Dashboard</Button>
            <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>Analytics</Button>
            <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>Reports</Button>
            <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>Settings</Button>
          </Stack>

          {/* Right section: User Actions */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
              Sign Out
            </Button>
            <IconButton
              color="inherit"
              aria-label="account of current user"
              sx={{ ml: { xs: 0, sm: 1 } }}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;