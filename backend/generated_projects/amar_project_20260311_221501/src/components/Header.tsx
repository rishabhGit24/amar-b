import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

interface NavLink {
  name: string;
  path: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/features' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact', path: '/contact' },
];

const Header: React.FC<HeaderProps> = ({
  title = 'My Application',
  showNav = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Branding / Title */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.05rem',
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: isMobile && showNav ? 1 : 0, // Allow title to grow on mobile if nav is shown
            }}
          >
            {title}
          </Typography>

          {showNav && (
            <>
              {/* Desktop Navigation */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'flex-end',
                  gap: 2,
                }}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link.name}
                    href={link.path}
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: 'text.primary',
                      display: 'block',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                      },
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Box>

              {/* Mobile Navigation */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'flex-end',
                }}
              >
                <IconButton
                  size="large"
                  aria-label="open navigation menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
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
                      bgcolor: 'background.paper',
                      boxShadow: theme.shadows[3],
                    },
                  }}
                >
                  {navLinks.map((link) => (
                    <MenuItem
                      key={link.name}
                      onClick={handleCloseNavMenu}
                      component="a"
                      href={link.path}
                      sx={{
                        color: 'text.primary',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                        },
                      }}
                    >
                      <Typography textAlign="center">{link.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;