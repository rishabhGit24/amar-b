import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = 'My Application',
  showNav = true,
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Example navigation items
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        boxShadow: theme.shadows[4],
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Application Title / Branding */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                color: theme.palette.secondary.light,
              },
            }}
          >
            {title}
          </Typography>

          {/* Mobile Navigation Menu Button */}
          {showNav && !isDesktop && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              <IconButton
                size="large"
                aria-label="open navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{
                  '&:focus-visible': {
                    outline: `2px solid ${theme.palette.secondary.main}`,
                    outlineOffset: '2px',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    backgroundColor: theme.palette.primary.light,
                    boxShadow: theme.shadows[6],
                    borderRadius: theme.shape.borderRadius,
                  },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={handleCloseNavMenu}
                    component="a"
                    href={item.path}
                    sx={{
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        color: theme.palette.secondary.main,
                      },
                      '&:focus-visible': {
                        outline: `2px solid ${theme.palette.secondary.main}`,
                        outlineOffset: '-2px',
                      },
                    }}
                  >
                    <Typography textAlign="center">{item.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* Application Title / Branding for Mobile */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                color: theme.palette.secondary.light,
              },
            }}
          >
            {title}
          </Typography>

          {/* Desktop Navigation Links */}
          {showNav && isDesktop && (
            <Stack
              direction="row"
              spacing={3}
              sx={{
                flexGrow: 1,
                justifyContent: 'flex-end',
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component="a"
                  href={item.path}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.secondary.light,
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${theme.palette.secondary.main}`,
                      outlineOffset: '2px',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;