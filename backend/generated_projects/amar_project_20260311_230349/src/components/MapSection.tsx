import * as React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Container,
  Link,
  useTheme,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

/**
 * Props for the MapSection component.
 * All props are optional and have sensible defaults.
 */
interface MapSectionProps {
  /**
   * The latitude of the location to display on the map.
   * @default 34.0163 // Example: The Coffee Bean & Tea Leaf, Santa Monica
   */
  latitude?: number;
  /**
   * The longitude of the location to display on the map.
   * @default -118.4965 // Example: The Coffee Bean & Tea Leaf, Santa Monica
   */
  longitude?: number;
  /**
   * The zoom level for the map. Higher values mean more zoomed in.
   * @default 15
   */
  zoom?: number;
}

/**
 * A reusable component to display an interactive map section,
 * typically showing a coffee shop's location.
 * It uses Material UI primitives for layout and styling,
 * ensuring a modern, responsive, and accessible design.
 */
const MapSection: React.FC<MapSectionProps> = ({
  latitude = 34.0163, // Default: The Coffee Bean & Tea Leaf, Santa Monica
  longitude = -118.4965,
  zoom = 15,
}) => {
  const theme = useTheme();

  // Construct the Google Maps embed URL.
  // Note: For production with specific features or higher usage,
  // consider using the Google Maps Embed API with an API key.
  // This basic URL works for simple embeds without an API key.
  const mapEmbedSrc =
    'https://maps.google.com/maps?q=' +
    latitude.toString() +
    ',' +
    longitude.toString() +
    '&z=' +
    zoom.toString() +
    '&output=embed';

  const googleMapsLink =
    'https://www.google.com/maps/search/?api=1&query=' +
    latitude.toString() +
    ',' +
    longitude.toString();

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 8 },
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4, md: 6 },
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Stack spacing={{ xs: 2, md: 4 }} alignItems="center" width="100%">
          <Typography
            variant="h3"
            component="h2"
            color={theme.palette.primary.dark}
            sx={{
              fontWeight: 700,
              mb: { xs: 1, md: 2 },
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
            }}
          >
            Find Our Coffee Haven
          </Typography>

          <Typography
            variant="body1"
            color={theme.palette.text.secondary}
            sx={{
              maxWidth: '700px',
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            }}
          >
            Discover the perfect spot for your daily brew. We're excited to
            welcome you to our cozy coffee shop.
          </Typography>

          <Box
            sx={{
              width: '100%',
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 Aspect Ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: theme.shape.borderRadius,
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.08)',
              mb: { xs: 2, md: 3 },
              '& iframe': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
                borderRadius: theme.shape.borderRadius,
              },
            }}
          >
            <iframe
              src={mapEmbedSrc}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Coffee Shop Location Map"
              aria-label="Interactive map showing the coffee shop's location"
            ></iframe>
          </Box>

          <Button
            component={Link}
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<LocationOnIcon />}
            sx={{
              mt: { xs: 2, md: 3 },
              py: { xs: 1.2, md: 1.5 },
              px: { xs: 3, md: 4 },
              fontSize: { xs: '0.9rem', md: '1.1rem' },
              fontWeight: 600,
              borderRadius: theme.shape.borderRadius * 1.5,
              textTransform: 'none',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
            aria-label="Open location in Google Maps"
          >
            Open in Google Maps
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default MapSection;