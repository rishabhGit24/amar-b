import React from 'react';
import { Box, Container, Stack, Typography, Button, Paper, useTheme } from '@mui/material';

interface CallToActionSectionProps {
  heading?: string;
  buttonText?: string;
  buttonLink?: string;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({
  heading = 'Ready to Indulge?',
  buttonText = 'Explore Our Menu',
  buttonLink = '/menu',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 }, // Responsive vertical padding for the entire section
        bgcolor: theme.palette.grey[50], // Light background color for the section
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6} // Distinct elevation for the call to action card
          sx={{
            p: { xs: 4, sm: 6, md: 8 }, // Responsive padding inside the card
            textAlign: 'center',
            borderRadius: theme.shape.borderRadius * 2, // Slightly more rounded corners for a modern look
            bgcolor: theme.palette.background.paper, // White background for the card
            boxShadow: theme.shadows[10], // Stronger shadow for a premium feel
            border: `1px solid ${theme.palette.divider}`, // Subtle border for definition
          }}
        >
          <Stack
            spacing={{ xs: 3, md: 4 }} // Responsive spacing between the heading and button
            alignItems="center" // Center align items horizontally
          >
            <Typography
              variant="h2" // Large heading variant for prominence
              component="h2" // Semantic HTML tag for accessibility
              sx={{
                fontWeight: 700, // Bold heading text
                color: theme.palette.primary.dark, // Darker primary color for strong contrast
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }, // Responsive font size
                lineHeight: 1.1, // Tighter line height for large text
                mb: 1, // Margin bottom for additional spacing
              }}
            >
              {heading}
            </Typography>
            <Button
              variant="contained" // Filled button style
              color="primary" // Primary theme color for the button
              size="large" // Large button size for easy interaction
              href={buttonLink} // Link destination
              aria-label={buttonText} // Accessibility label for screen readers
              sx={{
                mt: 2, // Margin top for spacing from the heading
                px: { xs: 4, md: 6 }, // Responsive horizontal padding
                py: { xs: 1.5, md: 2 }, // Responsive vertical padding
                fontSize: { xs: '1rem', md: '1.125rem' }, // Responsive font size for button text
                fontWeight: 600, // Semi-bold text for readability
                borderRadius: theme.shape.borderRadius * 1.5, // Slightly rounded button corners
                textTransform: 'none', // Prevent uppercase transformation
                boxShadow: theme.shadows[5], // Button shadow for depth
                '&:hover': {
                  boxShadow: theme.shadows[8], // Stronger shadow on hover
                  transform: 'translateY(-2px)', // Subtle lift effect on hover
                },
                transition: theme.transitions.create(['transform', 'box-shadow'], {
                  duration: theme.transitions.duration.shortest, // Smooth transition for hover effects
                }),
              }}
            >
              {buttonText}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CallToActionSection;