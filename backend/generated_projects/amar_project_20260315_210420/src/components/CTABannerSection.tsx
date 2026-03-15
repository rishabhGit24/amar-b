import React from 'react';
import { Box, Container, Typography, Button, Stack, useTheme } from '@mui/material';

interface CTABannerSectionProps {
  children?: React.ReactNode;
}

const CTABannerSection: React.FC<CTABannerSectionProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #3f51b5 100%)',
        boxShadow: theme.shadows[3],
      }}
    >
      <Container maxWidth="md">
        <Stack
          spacing={{ xs: 3, md: 4 }}
          alignItems="center"
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}
          >
            Ready to Elevate Your Experience?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              color: theme.palette.primary.light,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            }}
          >
            Discover our premium services and secure your spot today. Seamless booking, exceptional results.
          </Typography>
          {children && (
            <Box sx={{ mt: 4 }}>
              {children}
            </Box>
          )}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ pt: 2 }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                minWidth: { xs: '100%', sm: 200 },
                py: 1.5,
                px: 4,
                fontWeight: 600,
                boxShadow: theme.shadows[5],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              Book Now
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              sx={{
                minWidth: { xs: '100%', sm: 200 },
                py: 1.5,
                px: 4,
                fontWeight: 600,
                borderColor: theme.palette.secondary.light,
                color: theme.palette.secondary.light,
                '&:hover': {
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default CTABannerSection;