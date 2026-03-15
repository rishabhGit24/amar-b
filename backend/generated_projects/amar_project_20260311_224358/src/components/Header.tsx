import React from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

const Header: React.FC<HeaderProps> = ({
  title = 'My Application',
  showNav = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: theme.shadows[4],
        py: 1, // Vertical padding for a slightly taller bar
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Branding / Title */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontFamily: 'Montserrat, sans-serif', // Modern font choice
              fontWeight: 700,
              letterSpacing: '.08rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: isMobile ? 1 : 0, // Allow title to grow on mobile
              '&:focus-visible': {
                outline: `2px solid ${theme.palette.secondary.light}`,
                outlineOffset: '2px',
              },
            }}
          >
            {title}
          </Typography>

          {showNav && (
            <>
              {/* Mobile Navigation */}
              {isMobile ? (
                <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
                  <IconButton
                    size="large"
                    aria-label="open navigation menu"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                    sx={{
                      '&:focus-visible': {
                        outline: `2px solid ${theme.palette.secondary.light}`,
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
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[8],
                        borderRadius: theme.shape.borderRadius,
                      },
                    }}
                  >
                    {navItems.map((item) => (
                      <MenuItem
                        key={item.label}
                        onClick={handleCloseNavMenu}
                        component="a"
                        href={item.href}
                        sx={{
                          color: theme.palette.text.primary,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                          '&:focus-visible': {
                            outline: `2px solid ${theme.palette.secondary.light}`,
                            outlineOffset: '2px',
                          },
                        }}
                      >
                        <Typography textAlign="center">{item.label}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                {/* Desktop Navigation */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: theme.spacing(3) }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      component="a"
                      href={item.href}
                      onClick={handleCloseNavMenu} // Close menu if it was open (e.g., resized from mobile)
                      sx={{
                        my: 2,
                        color: 'inherit',
                        display: 'block',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          color: theme.palette.secondary.light,
                        },
                        '&:focus-visible': {
                          outline: `2px solid ${theme.palette.secondary.light}`,
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;