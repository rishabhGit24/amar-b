import React from 'react';
import { Box, Typography, Button, Stack, Container, useTheme } from '@mui/material';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Unlock Your Potential",
  subtitle = "Discover innovative solutions and elevate your business to new heights with our expert services.",
  image = "https://images.unsplash.com/photo-1517245381794-f2e7094543ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}) => {
  const theme = useTheme();

  return (
    <Box
      role="banner"
      aria-label="Prominent Hero Section"
      sx={{
        position: 'relative',
        minHeight: { xs: '60vh', md: '70vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
        overflow: 'hidden',
        backgroundImage: 'url(' + image + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // Distinctive modern visual: subtle gradient overlay for enhanced readability and depth
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Base dark overlay
          backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            lineHeight: 1.1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            fontWeight: 400,
            mb: 4,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)',
            maxWidth: '800px',
            mx: 'auto',
            opacity: 0.9,
          }}
        >
          {subtitle}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            size="large"
            color="primary"
            aria-label="Learn more about our services"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: theme.shape.borderRadius,
              fontWeight: 600,
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            Learn More
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            aria-label="Contact us for a consultation"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: theme.shape.borderRadius,
              fontWeight: 600,
              borderColor: theme.palette.common.white,
              color: theme.palette.common.white,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: theme.palette.common.white,
                boxShadow: theme.shadows[4],
              },
              transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
          >
            Contact Us
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;