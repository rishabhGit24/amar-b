import React from 'react';
import { Box, Container, Stack, Typography, Button, useTheme } from '@mui/material';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

const defaultProps: Required<HeroSectionProps> = {
  title: 'Discover Your Next Favorite Item',
  subtitle: 'Explore our curated collection of unique products, crafted with passion and precision.',
  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80', // Example shop image
  ctaText: 'Shop Now',
  ctaLink: '#shop',
};

const HeroSection: React.FC<HeroSectionProps> = ({
  title = defaultProps.title,
  subtitle = defaultProps.subtitle,
  image = defaultProps.image,
  ctaText = defaultProps.ctaText,
  ctaLink = defaultProps.ctaLink,
}) => {
  const theme = useTheme();

  return (
    <Box
      component="section" // Semantic HTML for the hero area
      sx={{
        backgroundColor: theme.palette.background.paper, // A slightly off-white or light grey background
        py: { xs: 8, md: 12 }, // Responsive padding top/bottom
        minHeight: { xs: 'auto', md: '70vh' }, // Minimum height for desktop
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }} // Stack vertically on mobile, horizontally on desktop
          spacing={{ xs: 6, md: 8 }} // Responsive spacing between items
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Text Content */}
          <Stack
            spacing={3}
            sx={{
              flex: 1, // Takes available space
              textAlign: { xs: 'center', md: 'left' }, // Center text on mobile, left on desktop
              order: { xs: 2, md: 1 }, // Image first on mobile, text first on desktop
            }}
          >
            <Typography
              variant="h2"
              component="h1" // Semantic H1 for the main title
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' }, // Responsive font size
                lineHeight: 1.2,
                color: theme.palette.primary.main, // Primary color for the title
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: { xs: '100%', md: '500px' }, // Max width for subtitle on desktop
                mx: { xs: 'auto', md: '0' }, // Center subtitle on mobile
              }}
            >
              {subtitle}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={ctaLink}
              aria-label={ctaText} // Accessibility for the button
              sx={{
                mt: 4, // Margin top for button
                width: { xs: '100%', sm: 'auto' }, // Full width on small screens, auto on larger
                px: 5, // Padding horizontal
                py: 1.5, // Padding vertical
                borderRadius: theme.shape.borderRadius, // Use theme's border radius
                boxShadow: theme.shadows[3], // Subtle shadow
                '&:hover': {
                  boxShadow: theme.shadows[6], // Lift effect on hover
                  transform: 'translateY(-2px)', // Slight upward movement
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              {ctaText}
            </Button>
          </Stack>

          {/* Image Content */}
          <Box
            sx={{
              flex: 1, // Takes available space
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' }, // Center image on mobile, right on desktop
              order: { xs: 1, md: 2 }, // Image first on mobile, text first on desktop
            }}
          >
            <Box
              component="img"
              src={image}
              alt={title} // Alt text for accessibility
              sx={{
                width: { xs: '100%', sm: '80%', md: '550px' }, // Responsive width
                maxWidth: '100%',
                height: { xs: '250px', sm: '350px', md: '450px' }, // Responsive height
                objectFit: 'cover', // Cover the area without distortion
                borderRadius: theme.shape.borderRadius * 2, // More rounded corners for the image
                boxShadow: theme.shadows[8], // Stronger shadow for the image to make it pop
                border: `4px solid ${theme.palette.divider}`, // Subtle border
              }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;