import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Icon,
  useTheme,
} from '@mui/material';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

// --- Constants and Types ---

const API_URL = 'https://api.example.com/contact'; // Placeholder API URL

interface HourEntry {
  day: string;
  time: string;
}

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

interface ContactFormResponse {
  success: boolean;
  message: string;
}

interface LocationSectionProps {
  address?: string;
  hours?: HourEntry[];
  mapUrl?: string;
}

// --- Component ---

const LocationSection: React.FC<LocationSectionProps> = ({
  address = '123 Main Street, Anytown, USA 12345',
  hours = [
    { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
  mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.2100000000005!2d-122.4194155846813!3d37.7749294797589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f21e2f7f%3A0x5d2e2e2e2e2e2e2e!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1678888888888!5m2!1sen!2sus',
}) => {
  const theme = useTheme();

  const [formState, setFormState] = useState<ContactFormState>({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      // Simulate API call
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: ContactFormResponse = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Your message has been sent successfully!');
        setFormState({ name: '', email: '', message: '' }); // Clear form
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: { xs: 4, md: 8 },
            color: theme.palette.primary.dark,
            textShadow: `1px 1px 2px ${theme.palette.grey[300]}`,
          }}
        >
          Visit Our Shop
        </Typography>

        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Left Column: Address, Hours, Parking */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: theme.shape.borderRadius * 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[10],
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Stack spacing={4}>
                {/* Address */}
                <Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      pb: 1,
                    }}
                  >
                    Our Location
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {address}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get directions to ${address}`}
                    sx={{
                      mt: 1,
                      py: 1.2,
                      px: 3,
                      borderRadius: theme.shape.borderRadius * 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  >
                    Get Directions
                  </Button>
                </Box>

                <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

                {/* Operating Hours */}
                <Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      pb: 1,
                    }}
                  >
                    Operating Hours
                  </Typography>
                  <List disablePadding>
                    {hours.map((entry, index) => (
                      <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={entry.day}
                          secondary={entry.time}
                          primaryTypographyProps={{ fontWeight: 500 }}
                          secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider sx={{ my: 3, borderColor: theme.palette.divider }} />

                {/* Parking Information */}
                <Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      pb: 1,
                    }}
                  >
                    Parking
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Icon component={LocalParkingIcon} color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Street parking available. Nearby public garage within 2 blocks.
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column: Map and Contact Form */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4} sx={{ height: '100%' }}>
              {/* Embedded Map */}
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: theme.shape.borderRadius * 2,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[10],
                  flexGrow: 1,
                }}
              >
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    pb: 1,
                    mb: 2,
                  }}
                >
                  Find Us
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: 250, sm: 350, md: 400 },
                    borderRadius: theme.shape.borderRadius,
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Shop Location Map"
                    aria-label="Google Maps showing the shop's location"
                  ></iframe>
                </Box>
              </Paper>

              {/* Contact Form */}
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: theme.shape.borderRadius * 2,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[10],
                }}
              >
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    pb: 1,
                    mb: 3,
                  }}
                >
                  Contact Us
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Your Name"
                    name="name"
                    autoComplete="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="message"
                    label="Your Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formState.message}
                    onChange={handleInputChange}
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: theme.shape.borderRadius * 1.5,
                      fontWeight: 600,
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
                  </Button>
                  {submitStatus && (
                    <Alert
                      severity={submitStatus}
                      sx={{ mt: 3, borderRadius: theme.shape.borderRadius }}
                    >
                      {submitMessage}
                    </Alert>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LocationSection;