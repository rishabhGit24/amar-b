import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  Grid,
  TextField,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';

// --- Constants and Types ---

const NEWSLETTER_API_URL = 'https://api.example.com/subscribe'; // Placeholder API URL

interface SocialLink {
  name: string;
  url: string;
  icon: React.ElementType;
  ariaLabel: string;
}

interface NavLink {
  name: string;
  url: string;
}

interface NewsletterApiResponse {
  success: boolean;
  message: string;
}

interface FooterProps {
  copyrightText?: string;
  socialLinks?: SocialLink[];
  quickLinks?: NavLink[];
  companyDescription?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
}

// --- Default Data ---

const defaultSocialLinks: SocialLink[] = [
  { name: 'Facebook', url: 'https://facebook.com', icon: FacebookIcon, ariaLabel: 'Visit us on Facebook' },
  { name: 'Twitter', url: 'https://twitter.com', icon: TwitterIcon, ariaLabel: 'Visit us on Twitter' },
  { name: 'Instagram', url: 'https://instagram.com', icon: InstagramIcon, ariaLabel: 'Visit us on Instagram' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: LinkedInIcon, ariaLabel: 'Visit us on LinkedIn' },
  { name: 'YouTube', url: 'https://youtube.com', icon: YouTubeIcon, ariaLabel: 'Visit us on YouTube' },
];

const defaultQuickLinks: NavLink[] = [
  { name: 'Home', url: '/' },
  { name: 'About Us', url: '/about' },
  { name: 'Services', url: '/services' },
  { name: 'Contact', url: '/contact' },
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Terms of Service', url: '/terms' },
];

const defaultCompanyDescription =
  'We are a leading provider of innovative solutions, committed to delivering excellence and driving success for our clients worldwide.';

// --- Footer Component ---

const Footer: React.FC<FooterProps> = ({
  copyrightText = `© ${new Date().getFullYear()} Your Company Name. All rights reserved.`,
  socialLinks = defaultSocialLinks,
  quickLinks = defaultQuickLinks,
  companyDescription = defaultCompanyDescription,
  newsletterTitle = 'Subscribe to Our Newsletter',
  newsletterDescription = 'Get the latest updates and offers directly in your inbox.',
}) => {
  const theme = useTheme();
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isValidEmail = (value: string): boolean => {
    // Basic email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage('');

    if (!isValidEmail(email)) {
      setIsError(true);
      setErrorMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      const response = await fetch(NEWSLETTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData: NewsletterApiResponse = await response.json();
        throw new Error(errorData.message || 'Failed to subscribe. Please try again.');
      }

      const data: NewsletterApiResponse = await response.json();
      if (data.success) {
        setIsSuccess(true);
        setEmail(''); // Clear email on success
      } else {
        setIsError(true);
        setErrorMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[900],
        color: theme.palette.common.white,
        py: { xs: 6, md: 8 },
        mt: 'auto', // Pushes footer to the bottom
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[5],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }} justifyContent="space-between">
          {/* Company Info Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: theme.palette.primary.light }}>
                Your Company Name
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.grey[400], lineHeight: 1.6 }}>
                {companyDescription}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {socialLinks.map((link) => (
                  <IconButton
                    key={link.name}
                    component={Link}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    sx={{
                      color: theme.palette.grey[400],
                      '&:hover': {
                        color: theme.palette.primary.main,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    <link.icon fontSize="small" />
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={6} md={2}>
            <Stack spacing={2}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.light }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.url}
                    color="inherit"
                    underline="hover"
                    variant="body2"
                    sx={{
                      color: theme.palette.grey[400],
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Newsletter Signup Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.light }}>
                {newsletterTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
                {newsletterDescription}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mt: 1,
                  p: 2,
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[800],
                  boxShadow: theme.shadows[3],
                }}
              >
                <TextField
                  label="Your Email Address"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.common.white,
                      '& fieldset': {
                        borderColor: theme.palette.grey[600],
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.grey[400],
                      '&.Mui-focused': {
                        color: theme.palette.primary.main,
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: theme.palette.grey[400],
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ color: theme.palette.grey[500], mr: 1 }} />
                    ),
                  }}
                  helperText={isError && !isSuccess ? errorMessage : ''}
                  error={isError && !isSuccess}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    py: 1.2,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Subscribe'}
                </Button>
                {isSuccess && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Thank you for subscribing!
                  </Alert>
                )}
                {isError && !isSuccess && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errorMessage}
                  </Alert>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.grey[700]}`,
            pt: 4,
            mt: { xs: 6, md: 8 },
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
            {copyrightText}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;