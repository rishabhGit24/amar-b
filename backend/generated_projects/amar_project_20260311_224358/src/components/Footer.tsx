import React from 'react';
import { Box, Container, Stack, Typography, Link, useTheme } from '@mui/material';

// Define props interface strictly adhering to the prompt's "Props: children?: React.ReactNode"
interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  // Internal defaults for company name and links, ensuring professional copy
  const companyName = 'Acme Corp.';
  const defaultLinks = [
    { text: 'Privacy Policy', href: '/privacy', ariaLabel: 'Privacy Policy' },
    { text: 'Terms of Service', href: '/terms', ariaLabel: 'Terms of Service' },
    { text: 'Contact Us', href: '/contact', ariaLabel: 'Contact Us' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        py: { xs: 4, md: 6 }, // Responsive vertical padding
        mt: 'auto', // Pushes footer to the bottom if parent is a flex column
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1], // Subtle elevation for a polished look
        width: '100%', // Ensure it spans the full width
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent={{ xs: 'center', md: 'space-between' }}
          alignItems={{ xs: 'center', md: 'flex-start' }} // Align items to start on desktop for better separation
          spacing={{ xs: 4, md: 2 }}
          sx={{ textAlign: { xs: 'center', md: 'left' } }} // Center text on mobile, left-align on desktop
        >
          {/* Copyright Section */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              &copy; {currentYear} {companyName}. All rights reserved.
            </Typography>
            {/* Optional children prop for additional custom content */}
            {children && (
              <Box sx={{ mt: 2 }}>
                {children}
              </Box>
            )}
          </Box>

          {/* Navigation Links Section */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 3 }}
            alignItems={{ xs: 'center', sm: 'flex-start' }} // Center links on mobile, align to start on tablet/desktop
          >
            {defaultLinks.map((linkItem, index) => (
              <Link
                key={index}
                href={linkItem.href}
                color="inherit" // Inherit color from parent Box
                underline="hover"
                variant="body2"
                aria-label={linkItem.ariaLabel || linkItem.text} // Accessibility for screen readers
                sx={{
                  fontWeight: theme.typography.fontWeightMedium,
                  transition: 'color 0.2s ease-in-out', // Smooth hover transition
                  '&:hover': {
                    color: theme.palette.primary.main, // Distinctive hover color
                  },
                  // Ensure sufficient touch target size on mobile for accessibility
                  py: { xs: 0.5, sm: 0 },
                  px: { xs: 1, sm: 0 },
                }}
              >
                {linkItem.text}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;