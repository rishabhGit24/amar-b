import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { ArrowForward, Star, Speed, Security } from '@mui/icons-material';
import PageTitleSection from '../components/PageTitleSection';
import LocationMapSection from '../components/LocationMapSection';
import ContactFormSection from '../components/ContactFormSection';

const ContactPage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 12,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h1" sx={{ mb: 3, fontWeight: 700 }}>
            Contact
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}>
            Address, opening hours, map, and contact form for inquiries. - Transform your experience with our innovative solution that delivers exceptional results and drives success.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            endIcon={<ArrowForward />}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', bgcolor: 'secondary.main' }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>

      {/* Components Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
          <PageTitleSection />
          <LocationMapSection />
          <ContactFormSection />
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" align="center" sx={{ mb: 6, color: 'primary.main' }}>
          Why Choose Our Platform
        </Typography>
        <Grid container spacing={4}>
          {[
            { 
              icon: <Star sx={{ fontSize: '3rem' }} />, 
              title: 'Premium Quality', 
              desc: 'Industry-leading standards with exceptional attention to detail. Our platform delivers superior performance and reliability that exceeds expectations.' 
            },
            { 
              icon: <Speed sx={{ fontSize: '3rem' }} />, 
              title: 'Lightning Fast', 
              desc: 'Optimized performance with cutting-edge technology. Experience blazing-fast load times and seamless interactions that keep users engaged.' 
            },
            { 
              icon: <Security sx={{ fontSize: '3rem' }} />, 
              title: 'Secure & Reliable', 
              desc: 'Enterprise-grade security with 99.9% uptime guarantee. Your data is protected with advanced encryption and robust backup systems.' 
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3, boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 600 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of satisfied customers who have transformed their business with our platform. 
            Start your journey today and experience the difference.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              sx={{ bgcolor: 'secondary.main', px: 4, py: 1.5 }}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ borderColor: 'white', color: 'white', px: 4, py: 1.5 }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactPage;
