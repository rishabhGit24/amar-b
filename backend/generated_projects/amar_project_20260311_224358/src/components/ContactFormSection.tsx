import React, { useState, FormEvent } from 'react';
import {
  Box,
  Container,
  Stack,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';

// --- Constants and Types ---

// Placeholder API endpoint for demonstration. In a real application,
// this would typically be loaded from environment variables.
const API_URL = '/api/contact';

/**
 * Defines the structure of the form data.
 */
interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Defines the expected structure of the API response.
 */
interface ContactFormResponse {
  success: boolean;
  message: string;
}

/**
 * Defines the props for the ContactFormSection component.
 * 'children' is optional and allows for additional content to be rendered within the section.
 */
interface ContactFormSectionProps {
  children?: React.ReactNode;
}

// --- Component Definition ---

const ContactFormSection: React.FC<ContactFormSectionProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for managing form input values
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // State for managing UI feedback during API interaction
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  // State for client-side validation errors
  const [errors, setErrors] = useState<Partial<ContactFormState>>({});

  /**
   * Performs client-side validation on the form data.
   * @returns true if the form is valid, false otherwise.
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormState> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles changes to form input fields, updating the formData state.
   * Also clears any validation errors for the field being edited.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    if (errors[name as keyof ContactFormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Handles the form submission process.
   * - Prevents default form submission.
   * - Sets loading state.
   * - Performs client-side validation.
   * - Simulates an asynchronous API call.
   * - Updates success/error states based on the API response.
   * - Resets the form on successful submission.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(null);
    setSnackbarOpen(false);

    if (!validateForm()) {
      setIsLoading(false);
      setIsError('Please correct the errors in the form.');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Simulate an API call using fetch.
      // In a real application, replace this with an actual fetch call to API_URL.
      const response = await new Promise<ContactFormResponse>((resolve) => {
        setTimeout(() => {
          // Simulate success or failure for demonstration purposes
          const success = Math.random() > 0.1; // 90% success rate
          if (success) {
            resolve({ success: true, message: 'Your message has been sent successfully!' });
          } else {
            // Simulate a server-side error message
            resolve({ success: false, message: 'Failed to send message. Please try again later.' });
          }
        }, 2000); // Simulate network delay of 2 seconds
      });

      if (response.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form fields
        setErrors({}); // Clear any lingering validation errors
      } else {
        setIsError(response.message);
      }
      setSnackbarOpen(true); // Open snackbar to show feedback
    } catch (error) {
      console.error('Submission error:', error);
      setIsError('An unexpected error occurred. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false); // Always stop loading regardless of success or failure
    }
  };

  /**
   * Handles closing the Snackbar component.
   */
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 6, md: 10 }, // Responsive vertical padding
        px: { xs: 2, sm: 3 }, // Responsive horizontal padding
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh', // Ensures the section takes up a good portion of the viewport
        backgroundColor: theme.palette.background.default, // Use theme's default background
      }}
    >
      <Paper
        elevation={8} // Distinct elevation for the form container
        sx={{
          width: '100%',
          maxWidth: 900, // Max width for the form card
          p: { xs: 3, sm: 5, md: 6 }, // Responsive padding inside the card
          borderRadius: theme.shape.borderRadius * 2, // More rounded corners
          backgroundColor: theme.palette.background.paper, // Use theme's paper background
          boxShadow: `0px 10px 30px rgba(0, 0, 0, 0.1), 0px 4px 10px rgba(0, 0, 0, 0.05)`, // Modern shadow effect
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, sm: 4 }, // Spacing between major sections within the card
        }}
      >
        {/* Section Title and Description */}
        <Stack
          spacing={{ xs: 1, sm: 2 }}
          textAlign="center"
          sx={{ mb: { xs: 2, sm: 3 } }} // Margin bottom for spacing
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.dark, // Stronger color for heading
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' }, // Responsive font size
              lineHeight: 1.1,
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto', // Center align description
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}
          >
            Have a question, feedback, or just want to say hello? Fill out the form below, and we'll get back to you as soon as possible.
          </Typography>
        </Stack>

        {/* Contact Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate // Disable browser's default validation
          aria-label="Contact Us Form" // Accessibility label for the form
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 3 }, // Spacing between form elements
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name} // Show error state if validation fails
                helperText={errors.name} // Display validation error message
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: theme.shape.borderRadius,
                    '& fieldset': { borderColor: theme.palette.grey[300] },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.dark,
                      borderWidth: '2px', // Thicker border on focus
                    },
                  },
                }}
              />
            </Grid>
            {/* Email Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: theme.shape.borderRadius,
                    '& fieldset': { borderColor: theme.palette.grey[300] },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.dark,
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </Grid>
            {/* Subject Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                error={!!errors.subject}
                helperText={errors.subject}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: theme.shape.borderRadius,
                    '& fieldset': { borderColor: theme.palette.grey[300] },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.dark,
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </Grid>
            {/* Message Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                error={!!errors.message}
                helperText={errors.message}
                multiline
                rows={isMobile ? 4 : 6} // Responsive row count for message field
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: theme.shape.borderRadius,
                    '& fieldset': { borderColor: theme.palette.grey[300] },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.dark,
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading} // Disable button while loading
            sx={{
              mt: { xs: 1, sm: 2 }, // Margin top for spacing
              py: { xs: 1.5, sm: 2 }, // Responsive vertical padding
              fontSize: { xs: '1rem', sm: '1.1rem' }, // Responsive font size
              fontWeight: 600,
              borderRadius: theme.shape.borderRadius,
              boxShadow: `0px 4px 15px ${theme.palette.primary.light}40`, // Subtle shadow
              '&:hover': {
                boxShadow: `0px 6px 20px ${theme.palette.primary.light}60`, // Enhanced shadow on hover
                transform: 'translateY(-2px)', // Slight lift effect on hover
              },
              transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
          </Button>
        </Box>

        {children} {/* Renders any children passed to the component */}
      </Paper>

      {/* Snackbar for transient success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Snackbar disappears after 6 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position at bottom center
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={isSuccess ? 'success' : 'error'} // Dynamic severity based on state
          sx={{ width: '100%' }}
          variant="filled" // Filled variant for better visibility
        >
          {isSuccess ? 'Your message has been sent successfully