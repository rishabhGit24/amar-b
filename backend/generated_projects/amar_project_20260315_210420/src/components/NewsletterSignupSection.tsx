import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Stack } from '@mui/material';

interface NewsletterSignupSectionProps {
  children?: React.ReactNode;
}

const NewsletterSignupSection: React.FC<NewsletterSignupSectionProps> = ({ children }) => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionMessage, setSubmissionMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage('');

    // Simulate an API call
    try {
      // In a real application, you would send 'email' to your backend
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      console.log('Newsletter signup email:', email);
      setSubmissionMessage('Thank you for subscribing! Check your inbox.');
      setEmail(''); // Clear the input field
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      setSubmissionMessage('Subscription failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 3,
          boxShadow: 6,
          p: { xs: 4, md: 6 },
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={{ xs: 2, md: 3 }} sx={{ maxWidth: 600, width: '100%' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            Stay Ahead with Our Newsletter
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Get exclusive updates, insights, and special offers delivered directly to your inbox. Join our community today!
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 1.5 },
              mt: 3,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextField
              label="Your Email Address"
              variant="filled"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              sx={{
                flexGrow: 1,
                maxWidth: { sm: 350 },
                '& .MuiFilledInput-root': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                  },
                  '&.Mui-focused': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  },
                },
                '& .MuiInputLabel-filled': {
                  color: 'primary.contrastText',
                  opacity: 0.8,
                },
                '& .MuiFilledInput-input': {
                  color: 'primary.contrastText',
                },
              }}
              inputProps={{ 'aria-label': 'Enter your email address for newsletter subscription' }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={isSubmitting}
              sx={{
                minWidth: { xs: '100%', sm: 150 },
                height: { xs: 56, sm: 'auto' },
                py: { sm: 1.5 },
                px: { sm: 3 },
                fontWeight: 600,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </Box>

          {submissionMessage && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: submissionMessage.includes('Thank you') ? 'success.light' : 'error.light',
                fontWeight: 500,
              }}
            >
              {submissionMessage}
            </Typography>
          )}

          {children}
        </Stack>
      </Box>
    </Container>
  );
};

export default NewsletterSignupSection;