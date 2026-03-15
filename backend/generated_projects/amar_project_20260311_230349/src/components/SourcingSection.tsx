import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  SvgIcon,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import GppGoodIcon from '@mui/icons-material/GppGood';
import EcoIcon from '@mui/icons-material/Eco';

// --- Constants ---
const API_URL = 'https://api.example.com/submit-sourcing-feedback'; // Placeholder API URL for demonstration

// --- Interfaces ---
interface SourcingDetail {
  title: string;
  description: string;
  icon?: React.ReactElement;
}

interface SourcingSectionProps {
  details?: SourcingDetail[];
}

interface ApiResponse {
  success: boolean;
  message: string;
}

// --- Default Data ---
const defaultSourcingDetails: SourcingDetail[] = [
  {
    title: 'Ethical Sourcing',
    description: 'We partner with suppliers who uphold fair labor practices and ensure safe working conditions across their operations.',
    icon: <LocalFloristIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Premium Quality Ingredients',
    description: 'Only the finest, freshest ingredients are selected, undergoing rigorous quality checks to meet our high standards.',
    icon: <GppGoodIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Sustainable Practices',
    description: 'Our commitment extends to environmentally responsible sourcing, minimizing ecological impact from farm to table.',
    icon: <EcoIcon fontSize="large" color="primary" />,
  },
];

// --- Component ---
const SourcingSection: React.FC<SourcingSectionProps> = ({ details = defaultSourcingDetails }) => {
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedbackText.trim()) {
      setIsError(true);
      setErrorMessage('Please enter your feedback before submitting.');
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real application, replace this with an actual fetch call
      // const response = await fetch(API_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ feedback: feedbackText }),
      // });
      // const data: ApiResponse = await response.json();

      // Placeholder for API response logic
      const mockSuccess = Math.random() > 0.2; // 80% chance of success
      const data: ApiResponse = {
        success: mockSuccess,
        message: mockSuccess ? 'Feedback submitted successfully.' : 'Failed to submit feedback due to a server error.',
      };

      if (data.success) {
        setFeedbackText('');
        setSnackbarOpen(true); // Show success snackbar
      } else {
        setIsError(true);
        setErrorMessage(data.message || 'Failed to submit feedback. Please try again.');
      }
    } catch (error: unknown) {
      setIsError(true);
      if (error instanceof Error) {
        setErrorMessage('Network error or server unreachable: ' + error.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: 'grey.50',
        color: 'text.primary',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Box>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2.25rem', md: '3.5rem' }, // Responsive font size
                color: 'primary.dark',
              }}
            >
              Our Commitment to Quality Sourcing
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.5rem' },
              }}
            >
              We believe that exceptional products begin with exceptional ingredients. Discover the principles that guide our sourcing decisions.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center">
            {details.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={4}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: { xs: 3, md: 4 },
                    borderRadius: '16px',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Box sx={{ mb: 2, color: 'primary.main' }}>
                    {item.icon ? (
                      React.cloneElement(item.icon, { sx: { fontSize: 60 } })
                    ) : (
                      <SvgIcon sx={{ fontSize: 60 }} color="primary">
                        {/* Default icon if none provided */}
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </SvgIcon>
                    )}
                  </Box>
                  <Typography variant="h4" component="h3" sx={{ mb: 1.5, fontWeight: 600, color: 'primary.dark' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: { xs: 6, md: 10 },
              p: { xs: 3, md: 5 },
              backgroundColor: 'background.paper',
              borderRadius: '16px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              maxWidth: '700px',
              width: '100%',
              mx: 'auto',
              textAlign: 'left',
            }}
          >
            <Typography variant="h4" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'primary.dark' }}>
              Have a Question About Our Sourcing?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              We're committed to transparency. Feel free to ask us anything about where our ingredients come from.
            </Typography>
            <TextField
              label="Your Question or Feedback"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              sx={{ mb: 2 }}
              aria-label="Enter your question or feedback about sourcing"
              error={isError && feedbackText.trim() === ''}
              helperText={isError && feedbackText.trim() === '' ? 'Feedback cannot be empty.' : ''}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              sx={{
                minWidth: '150px',
                py: 1.5,
                px: 4,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
            </Button>

            {isError && errorMessage && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {errorMessage}
              </Alert>
            )}
          </Box>
        </Stack>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckCircleOutlineIcon />
            <Typography>Thank you for your feedback! We will review it shortly.</Typography>
          </Stack>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SourcingSection;