import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';

interface HeroSectionProps {
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.dark',
        color: 'primary.contrastText',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '40vh', md: '50vh' },
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              lineHeight: 1.1,
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Unlock Your Potential with AMAR
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              maxWidth: '700px',
              mb: 4,
              opacity: 0.9,
            }}
          >
            Discover innovative solutions and services designed to elevate your business and personal growth.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ width: '100%', maxWidth: '400px' }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              Get Started Today
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderColor: 'primary.contrastText',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'primary.contrastText',
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
          {children}
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;