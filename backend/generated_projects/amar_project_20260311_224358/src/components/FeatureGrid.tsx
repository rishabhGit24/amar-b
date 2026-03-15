import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
  SvgIcon,
} from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WifiIcon from '@mui/icons-material/Wifi';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ChairIcon from '@mui/icons-material/Chair';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import EventNoteIcon from '@mui/icons-material/EventNote';

/**
 * Represents a single feature item in the grid.
 */
interface FeatureItem {
  /** The icon component to display for the feature. */
  icon: React.ElementType;
  /** The title of the feature. */
  title: string;
  /** A brief description of the feature. */
  description: string;
  /** Optional text for a call-to-action button. */
  buttonText?: string;
  /** Optional URL for the call-to-action button. */
  buttonLink?: string;
}

/**
 * Props for the FeatureGrid component.
 */
interface FeatureGridProps {
  /** An array of feature items to display. If not provided, a default set of features will be used. */
  features?: FeatureItem[];
}

/**
 * A visually polished and responsive grid component for displaying key features or offerings.
 * It uses Material UI primitives exclusively and adheres to strict TypeScript typing.
 *
 * @param {FeatureGridProps} props - The props for the component.
 * @returns {JSX.Element} The rendered FeatureGrid component.
 */
const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  const defaultFeatures: FeatureItem[] = [
    {
      icon: LocalCafeIcon,
      title: 'Premium Coffee Blends',
      description: 'Savor our expertly roasted, ethically sourced coffee beans from around the globe.',
      buttonText: 'Explore Menu',
      buttonLink: '#menu',
    },
    {
      icon: FastfoodIcon,
      title: 'Artisan Pastries & Snacks',
      description: 'Indulge in freshly baked croissants, muffins, and savory treats made daily.',
      buttonText: 'View Bakery',
      buttonLink: '#bakery',
    },
    {
      icon: WifiIcon,
      title: 'Complimentary Wi-Fi',
      description: 'Stay connected with our high-speed internet, perfect for work or leisure.',
      buttonText: 'Connect Now',
      buttonLink: '#wifi',
    },
    {
      icon: ChairIcon,
      title: 'Cozy Ambiance & Seating',
      description: 'Relax in our comfortable and inviting space, designed for your ultimate comfort.',
      buttonText: 'Find Us',
      buttonLink: '#location',
    },
    {
      icon: DeliveryDiningIcon,
      title: 'Delivery & Pickup Options',
      description: 'Enjoy your favorites at home with our convenient delivery and quick pickup services.',
      buttonText: 'Order Online',
      buttonLink: '#order',
    },
    {
      icon: EventNoteIcon,
      title: 'Host Your Events',
      description: 'Our versatile space is perfect for small gatherings, meetings, and private events.',
      buttonText: 'Book Now',
      buttonLink: '#events',
    },
  ];

  const itemsToRender = features || defaultFeatures;

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: 'background.default',
        ariaLabel: 'Our Coffee Shop Features',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          fontWeight="bold"
          color="text.primary"
          sx={{
            mb: { xs: 6, md: 8 },
            fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' },
            lineHeight: 1.2,
          }}
        >
          Discover What Makes Us Special
        </Typography>

        <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
          {itemsToRender.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 3, sm: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 10,
                  },
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <SvgIcon
                    component={feature.icon}
                    sx={{
                      fontSize: { xs: '3.5rem', sm: '4rem' },
                      color: 'primary.main',
                      mb: 1,
                    }}
                    aria-hidden="true" // Icon is decorative, title provides context
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '1.3rem', sm: '1.5rem' },
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      mb: feature.buttonText ? 2 : 0,
                      lineHeight: 1.6,
                      flexGrow: 1, // Allows description to take available space
                    }}
                  >
                    {feature.description}
                  </Typography>
                  {feature.buttonText && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      href={feature.buttonLink}
                      sx={{
                        mt: 'auto', // Pushes button to the bottom if description varies in length
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1, sm: 1.2 },
                        borderRadius: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      {feature.buttonText}
                    </Button>
                  )}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureGrid;