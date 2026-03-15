import React from 'react';
import { Box, Container, Stack, Typography, Button, useTheme, alpha } from '@mui/material';

interface CtaButtonProps {
  text?: string;
  onClick?: () => void;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  image?: string;
  ctaButton?: CtaButtonProps;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Unlock Your Potential',
  subtitle = 'Discover innovative solutions designed to elevate your experience and drive success.',
  image = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ctaButton,
}) => {
  const theme = useTheme();

  const defaultCtaButton: CtaButtonProps = {
    text: 'Learn More',
    onClick: () => console.log('Hero CTA clicked!'),
    href: '#',
    target: '_self',
    rel: 'noopener noreferrer',
  };

  const mergedCtaButton = { ...defaultCtaButton, ...ctaButton };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: '60vh', md: '70vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
        textAlign: 'center',
        overflow: 'hidden',
        backgroundImage: 'url(' + image + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: alpha(theme.palette.primary.dark, 0.6),
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 2,
          py: { xs: 8, md: 12 },
        }}
      >
        <Stack
          spacing={{ xs: 2, md: 3 }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              lineHeight: 1.1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              maxWidth: '700px',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              lineHeight: 1.5,
              opacity: 0.9,
              textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
              mb: { xs: 2, md: 3 },
            }}
          >
            {subtitle}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={mergedCtaButton.onClick}
            href={mergedCtaButton.href}
            target={mergedCtaButton.target}
            rel={mergedCtaButton.rel}
            sx={{
              mt: { xs: 3, md: 4 },
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              borderRadius: theme.shape.borderRadius,
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1.15rem' },
              textTransform: 'none',
              boxShadow: theme.shadows[8],
              '&:hover': {
                boxShadow: theme.shadows[12],
                backgroundColor: alpha(theme.palette.secondary.main, 0.9),
              },
              color: theme.palette.secondary.contrastText,
            }}
            aria-label={mergedCtaButton.text}
          >
            {mergedCtaButton.text}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;