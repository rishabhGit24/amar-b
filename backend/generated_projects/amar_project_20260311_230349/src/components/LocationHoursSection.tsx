import React, { useState } from 'react';
import {
  Box,
  Stack,
  Grid,
  Paper,
  Card,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Link,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormHelperText,
  Container,
  useTheme,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// --- Constants and Types ---

const API_URL = 'https://api.example.com/contact'; // Placeholder API URL

interface HourEntry {
  day: string;
  time: string;
}

interface LocationHoursSectionProps {
  address?: string;
  phone?: string;
  email?: string;
  hours?: HourEntry[];
}

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

// --- Default Data ---

const defaultAddress = '123 Main Street, Anytown, CA 90210';
const defaultPhone = '+1 (555) 123-4567';
const defaultEmail = 'info@example.com';
const defaultHours: HourEntry[] = [
  { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
  { day: 'Sunday', time: 'Closed' },
];

const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({
  address = defaultAddress,
  phone = defaultPhone,
  email = defaultEmail,
  hours = defaultHours,
}) => {
  const theme = useTheme();

  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setFormErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      const response = await new Promise<ApiResponse>((resolve) => {
        setTimeout(() => {
          // Simulate success or failure
          const success = Math.random() > 0.2; // 80% success rate
          if (success) {
            resolve({ success: true, message: 'Your message has been sent successfully!' });
          } else {
            resolve({ success: false, message: 'Failed to send message. Please try again later.' });
          }
        }, 1500);
      });

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
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.grey[50],
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
      }}
      aria-labelledby="location-hours-section-title"
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          id="location-hours-section-title"
          align="center"
          sx={{
            mb: { xs: 4, md: 8 },
            fontWeight: 700,
            color: theme.palette.primary.dark,
            textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          Visit Us or Get In Touch
        </Typography>

        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Left Column: Address & Hours */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              {/* Address Card */}
              <Card
                component={Paper}
                elevation={6}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: theme.shape.borderRadius * 2,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[3],
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LocationOnIcon sx={{ mr: 1, color: theme.palette.secondary.main }} /> Our Location
                </Typography>
                <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
                <List disablePadding>
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary={address} primaryTypographyProps={{ variant: 'body1' }} />
                  </ListItem>
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link
                          href={'tel:' + phone.replace(/\s|\(|\)|-/g, '')}
                          color="inherit"
                          underline="hover"
                          sx={{ fontWeight: 500 }}
                        >
                          {phone}
                        </Link>
                      }
                      primaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                  <ListItem disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link
                          href={'mailto:' + email}
                          color="inherit"
                          underline="hover"
                          sx={{ fontWeight: 500 }}
                        >
                          {email}
                        </Link>
                      }
                      primaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                </List>
              </Card>

              {/* Hours Card */}
              <Card
                component={Paper}
                elevation={6}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: theme.shape.borderRadius * 2,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[3],
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <AccessTimeIcon sx={{ mr: 1, color: theme.palette.secondary.main }} /> Operating Hours
                </Typography>
                <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />
                <List disablePadding>
                  {hours.map((entry, index) => (
                    <ListItem disableGutters key={index} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={entry.day}
                        secondary={entry.time}
                        primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'body2', color: theme.palette.text.secondary }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Stack>
          </Grid>

          {/* Right Column: Contact Form */}
          <Grid item xs={12} md={6}>
            <Card
              component={Paper}
              elevation={6}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: theme.shape.borderRadius * 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[3],
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <EmailIcon sx={{ mr: 1, color: theme.palette.secondary.main }} /> Send Us a Message
              </Typography>
              <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />

              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Stack spacing={3}>
                  <TextField
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    required
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    aria-required="true"
                    aria-invalid={!!formErrors.name}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: theme.shape.borderRadius,
                      },
                    }}
                  />
                  <TextField
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    required
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    aria-required="true"
                    aria-invalid={!!formErrors.email}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: theme.shape.borderRadius,
                      },
                    }}
                  />
                  <TextField
                    label="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={5}
                    variant="outlined"
                    required
                    error={!!formErrors.message}
                    helperText={formErrors.message}
                    aria-required="true"
                    aria-invalid={!!formErrors.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: theme.shape.borderRadius,
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      mt: 2,
                      borderRadius: theme.shape.borderRadius,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      boxShadow: theme.shadows[3],
                      '&:hover': {
                        boxShadow: theme.shadows[6],
                      },
                    }}
                    aria-label="Send Message"
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
                  </Button>

                  {isSuccess && (
                    <Alert
                      severity="success"
                      icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                      sx={{ mt: 2, borderRadius: theme.shape.borderRadius }}
                      aria-live="assertive"
                    >
                      Your message has been sent successfully! We will get back to you soon.
                    </Alert>
                  )}
                  {isError && (
                    <Alert
                      severity="error"
                      icon={<ErrorOutlineIcon fontSize="inherit" />}
                      sx={{ mt: 2, borderRadius: theme.shape.borderRadius }}
                      aria-live="assertive"
                    >
                      Failed to send message. Please check your internet connection or try again later.
                    </Alert>
                  )}
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LocationHoursSection;