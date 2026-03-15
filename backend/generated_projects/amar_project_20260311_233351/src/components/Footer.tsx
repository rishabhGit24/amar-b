import React from 'react';
import { Box, Container, Stack, Typography, IconButton, Link, useTheme } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X'; // X is the new Twitter icon

interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white,
        py: { xs: 4, md: 6 },
        mt: 'auto', // Pushes the footer to the bottom if the parent container uses flex-direction: column
        borderTop: '1px solid',
        borderColor: theme.palette.grey[800],
        boxShadow: '0px -2px 4px -1px rgba(0,0,0,0.2), 0px -4px 5px 0px rgba(0,0,0,0.14), 0px -1px 10px 0px rgba(0,0,0,0.12)', // Subtle elevation
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 3, md: 2 }}
        >
          <Typography variant="body2" color="inherit" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            &copy; {currentYear} Your Company Name. All rights reserved.
          </Typography>

          {children && (
            <Box sx={{ order: { xs: 3, md: 2 } }}>
              {children}
            </Box>
          )}

          <Stack direction="row" spacing={1} sx={{ order: { xs: 2, md: 3 } }}>
            <IconButton
              component={Link}
              href="https://github.com/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              sx={{ color: 'inherit', '&:hover': { color: theme.palette.primary.light } }}
            >
              <GitHubIcon fontSize="medium" />
            </IconButton>
            <IconButton
              component={Link}
              href="https://linkedin.com/company/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              sx={{ color: 'inherit', '&:hover': { color: theme.palette.primary.light } }}
            >
              <LinkedInIcon fontSize="medium" />
            </IconButton>
            <IconButton
              component={Link}
              href="https://x.com/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter) profile"
              sx={{ color: 'inherit', '&:hover': { color: theme.palette.primary.light } }}
            >
              <TwitterIcon fontSize="medium" />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;