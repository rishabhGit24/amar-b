import React from 'react';
import { Box, Button, Typography, Container, Stack, Paper, useTheme } from '@mui/material';

interface CallToActionSectionProps {
  title?: string;
  buttonText?: string;
  buttonLink?: string;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({
  title = 'Ready to Transform Your Digital Presence?',
  buttonText = 'Get Started Today',
  buttonLink = '#contact',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 }, // Responsive vertical padding for the entire section
        bgcolor: theme.palette.grey[50], // Light background for the section
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6} // Distinctive elevation for the CTA card
          sx={{
            p: { xs: 4, sm: 6, md: 8 }, // Responsive padding inside the paper card
            borderRadius: theme.shape.borderRadius * 2, // Slightly more rounded corners for a modern look
            textAlign: 'center',
            bgcolor: theme.palette.background.paper, // White background for the card
            boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.1)`, // Custom, softer shadow for depth
            border: `1px solid ${theme.palette.divider}`, // Subtle border for definition
          }}
        >
          <Stack
            spacing={{ xs: 3, md: 4 }} // Responsive spacing between title and button
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="h4" // Base variant for the title
              component="h2" // Semantic HTML for SEO and accessibility
              sx={{
                fontWeight: 700, // Bold title for emphasis
                color: theme.palette.primary.dark, // Stronger primary color for text
                lineHeight: 1.2,
                mb: 1, // Margin bottom for additional spacing
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' }, // Responsive font size
              }}
            >
              {title}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={buttonLink}
              aria-label={buttonText} // Accessibility: describes the button's action
              sx={{
                mt: 2, // Margin top for spacing from the title
                px: { xs: 4, md: 6 }, // Responsive horizontal padding for the button
                py: { xs: 1.5, md: 2 }, // Responsive vertical padding for the button
                fontSize: { xs: '1rem', md: '1.15rem' }, // Responsive font size for the button text
                fontWeight: 600,
                borderRadius: theme.shape.borderRadius * 1.5, // Slightly more rounded button
                textTransform: 'none', // Keep button text as provided (e.g., "Get Started Today")
                boxShadow: `0px 4px 12px ${theme.palette.primary.light}`, // Soft shadow for the button
                '&:hover': {
                  boxShadow: `0px 6px 16px ${theme.palette.primary.main}`, // Enhanced shadow on hover
                  transform: 'translateY(-2px)', // Subtle lift effect on hover
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', // Smooth transition
                },
                '&:focus-visible': { // Ensure visible focus state for accessibility
                  outline: `2px solid ${theme.palette.primary.dark}`,
                  outlineOffset: 2,
                },
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