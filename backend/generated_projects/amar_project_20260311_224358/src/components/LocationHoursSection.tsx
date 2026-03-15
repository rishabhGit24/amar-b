import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  Container,
  useTheme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// --- Constants and Types ---

const API_ENDPOINT = 'https://api.example.com/contact'; // Mock API endpoint

interface HourEntry {
  day: string;
  time: string;
}

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

interface LocationHoursSectionProps {
  hours?: HourEntry[];
  address?: string;
  phone?: string;
}

// --- Default Data ---

const defaultHours: HourEntry[] = [
  { day: 'Monday - Friday', time: '9:00 AM - 5:00 PM' },
  { day: 'Saturday', time: '10:00 AM - 2:00 PM' },
  { day: 'Sunday', time: 'Closed' },
];

const defaultAddress = '123 Main Street, Anytown, USA 12345';
const defaultPhone = '+1 (555) 123-4567';

// --- Component Definition ---

const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({
  hours = defaultHours,
  address = defaultAddress,
  phone = defaultPhone,
}) => {
  const theme = useTheme();

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<FormValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (formErrors[name as keyof FormValidationErrors]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormValidationErrors];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: FormValidationErrors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSuccess(false);
    setIsError(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      const response = await new Promise<ApiResponse>((resolve) => {
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% success rate
            resolve({ success: true, message: 'Your message has been sent successfully!' });
          } else {
            resolve({ success: false, message: 'Failed to send message. Please try again later.' });
          }
        }, 1500);
      });

      // In a real application, you would use fetch:
      /*
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse = await response.json();
      */

      if (response.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' }); // Clear form on success
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 4, md: 8 }}
        alignItems="stretch"
        justifyContent="center"
      >
        {/* Location Info Section */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: theme.shape.borderRadius,
            flex: 1,
            minWidth: { xs: '100%', md: '45%' },
            bgcolor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 3, md: 4 },
            boxShadow: theme.shadows[10],
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: { xs: 2, md: 3 },
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Visit Us
          </Typography>

          {/* Operating Hours */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon color="primary" />
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Operating Hours
              </Typography>
            </Stack>
            {hours.map((entry, index) => (
              <Stack key={index} direction="row" justifyContent="space-between" sx={{ pl: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  {entry.day}
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                  {entry.time}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {/* Address */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnIcon color="primary" />
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Our Location
              </Typography>
            </Stack>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="text.primary"
              sx={{ pl: 4, display: 'block' }}
              aria-label={`View ${address} on Google Maps`}
            >
              <Typography variant="body1">{address}</Typography>
            </Link>
          </Stack>

          {/* Phone */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PhoneIcon color="primary" />
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Contact Us
              </Typography>
            </Stack>
            <Link
              href={`tel:${phone.replace(/\s/g, '')}`}
              underline="hover"
              color="text.primary"
              sx={{ pl: 4, display: 'block' }}
              aria-label={`Call us at ${phone}`}
            >
              <Typography variant="body1">{phone}</Typography>
            </Link>
          </Stack>
        </Paper>

        {/* Contact Form Section */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: theme.shape.borderRadius,
            flex: 1,
            minWidth: { xs: '100%', md: '45%' },
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[10],
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: { xs: 2, md: 3 },
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Send Us a Message
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                variant="outlined"
                aria-label="Your Name"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Your Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                variant="outlined"
                aria-label="Your Email Address"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <TextField
                fullWidth
                label="Your Message"
                name="message"
                multiline
                rows={6}
                value={formData.message}
                onChange={handleChange}
                error={!!formErrors.message}
                helperText={formErrors.message}
                variant="outlined"
                aria-label="Your Message"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 1,
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                }}
                aria-label="Send Message"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>

              {isSuccess && (
                <Alert severity="success" sx={{ mt: 2 }} aria-live="polite">
                  Your message has been sent successfully! We'll get back to you soon.
                </Alert>
              )}
              {isError && (
                <Alert severity="error" sx={{ mt: 2 }} aria-live="polite">
                  Failed to send message. Please try again later.
                </Alert>
              )}
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default LocationHoursSection;