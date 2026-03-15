import React from 'react';
import { Box, Container, Typography, Stack, Link, IconButton, useTheme } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.grey[300],
        py: { xs: 4, md: 6 },
        borderTop: `1px solid ${theme.palette.grey[700]}`,
        mt: 'auto', // Pushes footer to the bottom
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 8 }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          textAlign={{ xs: 'center', md: 'left' }}
        >
          {/* Company Info & Copyright */}
          <Stack spacing={1} sx={{ flexShrink: 0 }}>
            <Typography variant="h6" component="div" sx={{ color: theme.palette.common.white, fontWeight: 700 }}>
              AMAR
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
              Building the future, one component at a time.
            </Typography>
            <Typography variant="caption" sx={{ mt: 2, color: theme.palette.grey[500] }}>
              © 2023 AMAR. All rights reserved.
            </Typography>
            {children} {/* Render children if provided */}
          </Stack>

          {/* Navigation Links */}
          <Stack spacing={1} sx={{ minWidth: 120 }}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.common.white, mb: 1 }}>
              Quick Links
            </Typography>
            <Link href="#" color="inherit" underline="hover" sx={{ color: theme.palette.grey[300] }}>
              About Us
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ color: theme.palette.grey[300] }}>
              Services
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ color: theme.palette.grey[300] }}>
              Contact
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ color: theme.palette.grey[300] }}>
              Privacy Policy
            </Link>
          </Stack>

          {/* Social Media Links */}
          <Stack spacing={1} sx={{ minWidth: 120 }}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.common.white, mb: 1 }}>
              Connect
            </Typography>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <IconButton
                aria-label="GitHub"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: theme.palette.grey[300], '&:hover': { color: theme.palette.common.white } }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: theme.palette.grey[300], '&:hover': { color: theme.palette.common.white } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: theme.palette.grey[300], '&:hover': { color: theme.palette.common.white } }}
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;