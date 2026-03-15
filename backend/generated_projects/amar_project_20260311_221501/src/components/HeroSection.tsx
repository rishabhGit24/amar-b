import React from 'react';
import { Box, Container, Typography, Button, Stack, useTheme } from '@mui/material';

/**
 * @interface CtaButtonProps
 * @description Defines the properties for the Call-to-Action button.
 */
interface CtaButtonProps {
  /** The text displayed on the button. */
  text?: string;
  /** Optional click handler for the button. */
  onClick?: () => void;
  /** The URL the button navigates to. If provided, the button will render as an anchor. */
  href?: string;
  /** The visual variant of the button. */
  variant?: 'text' | 'outlined' | 'contained';
  /** The color of the button, using Material UI's theme palette. */
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /** The size of the button. */
  size?: 'small' | 'medium' | 'large';
}

/**
 * @interface HeroSectionProps
 * @description Defines the properties for the HeroSection component.
 */
interface HeroSectionProps {
  /** The main title of the hero section. */
  title?: string;
  /** The subtitle or descriptive text below the title. */
  subtitle?: string;
  /** The URL of the background image for the hero section. */
  image?: string;
  /** Configuration for the Call-to-Action button. */
  ctaButton?: CtaButtonProps;
}

/**
 * @component HeroSection
 * @description A prominent full-width section with a captivating image, shop name, and a call-to-action.
 * @param {HeroSectionProps} props - The properties for the HeroSection component.
 * @returns {JSX.Element} A React functional component.
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  image,
  ctaButton,
}) => {
  const theme = useTheme();

  // Sensible defaults for all props
  const defaultTitle = "Your Brand Name";
  const defaultSubtitle = "Discover Quality, Experience Excellence.";
  const defaultImage = "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"; // Example high-quality image
  const defaultCtaButton: CtaButtonProps = {
    text: "Shop Now",
    href: "#products",
    variant: "contained",
    color: "primary",
    size: "large",
  };

  const currentTitle = title ?? defaultTitle;
  const currentSubtitle = subtitle ?? defaultSubtitle;
  const currentImage = image ?? defaultImage;
  const currentCtaButton = { ...defaultCtaButton, ...ctaButton };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: '400px', sm: '500px', md: '600px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${currentImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: theme.palette.common.white, // Default text color for content
        overflow: 'hidden', // Ensure no overflow from image
      }}
      aria-label="Hero section with brand name and call to action"
      role="banner"
    >
      {/* Overlay for better text readability and visual depth */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
          // Optional: subtle gradient for more visual interest
          // background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ zIndex: 1, py: { xs: 4, md: 8 } }}>
        <Stack
          spacing={{ xs: 2, sm: 3, md: 4 }}
          alignItems="center"
          textAlign="center"
          sx={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)', // Text shadow for readability
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 700,
              letterSpacing: { xs: '-0.02em', sm: '-0.03em' },
              lineHeight: 1.1,
            }}
          >
            {currentTitle}
          </Typography>

          <Typography
            variant="h4"
            component="p"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              fontWeight: 400,
              maxWidth: '600px',
              opacity: 0.9,
            }}
          >
            {currentSubtitle}
          </Typography>

          <Button
            variant={currentCtaButton.variant}
            color={currentCtaButton.color}
            size={currentCtaButton.size}
            href={currentCtaButton.href}
            onClick={currentCtaButton.onClick}
            sx={{
              mt: { xs: 3, sm: 4 }, // Margin top for spacing from subtitle
              minWidth: { xs: '180px', sm: '220px' },
              py: { xs: 1.5, sm: 2 },
              px: { xs: 3, sm: 4 },
              borderRadius: theme.shape.borderRadius * 2, // More rounded corners
              boxShadow: theme.shadows[8], // Distinct elevation
              transition: theme.transitions.create(['background-color', 'box-shadow', 'transform'], {
                duration: theme.transitions.duration.standard,
              }),
              '&:hover': {
                boxShadow: theme.shadows[12], // Higher elevation on hover
                transform: 'translateY(-2px)', // Subtle lift effect
              },
              // Ensure text color contrast for contained buttons
              ...(currentCtaButton.variant === 'contained' && {
                color: theme.palette.getContrastText(theme.palette[currentCtaButton.color || 'primary'].main),
              }),
            }}
            aria-label={currentCtaButton.text}
          >
            {currentCtaButton.text}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;