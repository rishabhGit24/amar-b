import React from 'react';
import { Box, Button, Container, Divider, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface FooterProps {
  copyrightText?: string;
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({
  copyrightText = '© 2026 Bella Napoli Pizzeria. All rights reserved.',
  children,
}) => {
  return (
    <Box sx={{ bgcolor: '#2A211D', color: '#FFF8EE', mt: 10, pt: 6, pb: 4 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Bella Napoli Pizzeria</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, maxWidth: 360 }}>
              Wood-fired pizza, handmade pasta, and warm Brooklyn hospitality. Open daily for dine-in, pickup, and delivery.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button component={RouterLink} to="/menu" variant="contained" color="secondary">View Menu</Button>
            <Button href="tel:+17185557499" variant="outlined" sx={{ color: '#FFF8EE', borderColor: '#FFF8EE' }}>Call Now</Button>
          </Stack>
        </Stack>
        {children}
        <Divider sx={{ my: 3, borderColor: 'rgba(255,248,238,0.2)' }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>{copyrightText}</Typography>
          <Stack direction="row" spacing={2}>
            <Typography component={RouterLink} to="/about" variant="caption" sx={{ color: '#FFF8EE', textDecoration: 'none' }}>Our Story</Typography>
            <Typography component={RouterLink} to="/contact" variant="caption" sx={{ color: '#FFF8EE', textDecoration: 'none' }}>Reservations</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
