import React from 'react';
import { Box, Typography, Paper, Stack, Button, Link, useTheme } from '@mui/material';

/**
 * Props for the MapSection component.
 * All props are optional and have sensible default values.
 */
interface MapSectionProps {
  /**
   * The latitude coordinate for the map's center.
   * @default 34.0522 (Los Angeles)
   */
  latitude?: number;
  /**
   * The longitude coordinate for the map's center.
   * @default -118.2437 (Los Angeles)
   */
  longitude?: number;
  /**
   * The zoom level for the map.
   * @default 15
   */
  zoom?: number;
}

/**
 * A production-ready, visually polished, and accessible component
 * for displaying an interactive map of a coffee shop's location.
 * It uses Material UI primitives exclusively for layout and UI.
 */
const MapSection: React.FC<MapSectionProps> = ({
  latitude = 34.0522, // Default: Los Angeles latitude
  longitude = -118.2437, // Default: Los Angeles longitude
  zoom = 15, // Default: A good street-level zoom
}) => {
  const theme = useTheme();

  // Construct a Google Maps URL for directions based on provided coordinates.
  // This URL will open an interactive map in a new tab.
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  // A placeholder for a Google Static Maps API URL.
  // In a real application, 'YOUR_GOOGLE_MAPS_STATIC_API_KEY' would be replaced
  // with an actual API key, typically loaded from environment variables.
  const staticMapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=600x300&maptype=roadmap&markers=color:red%7Clabel:C%7C${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_STATIC_API_KEY`;

  return (
    <Box
      component="section" // Semantic HTML tag for better accessibility, rendered as a Box
      sx={{
        py: { xs: 6, md: 10 }, // Responsive vertical padding
        px: { xs: 2, sm: 3, md: 4 }, // Responsive horizontal padding
        backgroundColor: theme.palette.grey[50], // Light background for the section
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh', // Ensure sufficient height for the section
      }}
      aria-labelledby="map-section-title" // Link to the main title for accessibility
    >
      <Paper
        elevation={8} // Distinctive elevation for the main card
        sx={{
          width: '100%',
          maxWidth: 1200, // Max width for desktop layouts
          borderRadius: theme.shape.borderRadius * 2, // Rounded corners
          overflow: 'hidden', // Ensures content respects border radius
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on mobile, horizontally on desktop
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[10], // Stronger shadow for a premium feel
        }}
      >
        {/* Map Visualization Area */}
        <Box
          sx={{
            flex: 1, // Takes available space
            minHeight: { xs: 300, md: 'auto' }, // Minimum height for mobile map
            height: { md: 550 }, // Fixed height for desktop map
            backgroundColor: theme.palette.grey[200], // Fallback background
            backgroundImage: `url(${staticMapImageUrl})`, // Static map image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            '&::before': { // Subtle overlay for visual depth
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.15)', // Darker overlay
            },
          }}
          aria-label="Coffee shop location on a map" // Accessible label for the map image
          role="img" // Indicates this Box serves as an image for screen readers
        >
          {/* Button directly on the map to view interactive version */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link} // Use MUI Link for external navigation
            href={googleMapsUrl}
            target="_blank" // Open in new tab
            rel="noopener noreferrer" // Security best practice for target="_blank"
            sx={{
              zIndex: 1, // Ensure button is above the overlay
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.02)', // Subtle hover effect
              },
              boxShadow: theme.shadows[6], // Prominent shadow for the button
              textTransform: 'none', // Keep button text case as is
              fontWeight: theme.typography.fontWeightMedium,
              fontSize: '1.15rem',
              py: 1.75,
              px: 4,
              borderRadius: theme.shape.borderRadius * 3, // More rounded button
              transition: 'transform 0.2s ease-in-out', // Smooth transition
            }}
            aria-label="Open interactive map for directions to our coffee shop"
          >
            View on Google Maps
          </Button>
        </Box>

        {/* Information and Call to Action Section */}
        <Stack
          spacing={3} // Spacing between elements in the stack
          sx={{
            flex: 1, // Takes available space
            p: { xs: 4, md: 6 }, // Responsive padding
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: { xs: 'flex-start', md: 'flex-start' }, // Align text left
            textAlign: { xs: 'left', md: 'left' },
          }}
        >
          <Typography
            variant="h4"
            component="h2" // Semantic heading for the section title
            id="map-section-title" // ID for aria-labelledby
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              color: theme.palette.text.primary,
              mb: 1, // Margin bottom for spacing
              lineHeight: 1.2,
            }}
          >
            Find Our Cozy Corner
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.7, // Improved readability
              maxWidth: 550, // Constrain text width for better readability
              fontSize: '1.05rem',
            }}
          >
            Nestled in the heart of the city, our coffee shop is the perfect spot to relax, work, or catch up with friends. We're easily accessible and always ready to welcome you with a warm brew and a friendly smile. Come visit us!
          </Typography>
          <Box sx={{ mt: 4 }}> {/* More top margin for the button */}
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={Link} // Use MUI Link for external navigation
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textTransform: 'none',
                fontWeight: theme.typography.fontWeightMedium,
                fontSize: '1.05rem',
                py: 1.25,
                px: 3,
                borderColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                borderRadius: theme.shape.borderRadius * 3,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                  borderColor: theme.palette.primary.main,
                  boxShadow: theme.shadows[2], // Subtle shadow on hover
                },
              }}
              aria-label="Get detailed directions to our coffee shop"
            >
              Get Directions
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MapSection;