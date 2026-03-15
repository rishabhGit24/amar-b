import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { ArrowForward, Star, Speed, Security } from '@mui/icons-material';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import CallToActionSection from '../components/CallToActionSection';

const HomePage: React.FC = () => {
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
            Welcome to Our Platform
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: '700px', mx: 'auto' }}>
            Landing page with hero, value highlights, and clear calls to action.
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
          <HeroSection />
          <FeatureSection />
          <CallToActionSection />
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" align="center" sx={{ mb: 6, color: 'primary.main' }}>
          Highlights
        </Typography>
        <Grid container spacing={4}>
          {[
            { 
              icon: <Star sx={{ fontSize: '3rem' }} />, 
              title: 'Fresh Daily Preparation', 
              desc: 'Every item is prepared with attention to consistency, flavor, and presentation for a complete dining experience.' 
            },
            { 
              icon: <Speed sx={{ fontSize: '3rem' }} />, 
              title: 'Fast and Friendly Service', 
              desc: 'Orders and reservations are handled quickly so guests can enjoy smooth, reliable service during peak hours.' 
            },
            { 
              icon: <Security sx={{ fontSize: '3rem' }} />, 
              title: 'Trusted Local Favorite', 
              desc: 'Built around quality ingredients and neighborhood hospitality that keeps guests returning week after week.' 
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
            Ready to Visit?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Plan your next meal, reserve a table, or browse the menu for today’s specials.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              sx={{ bgcolor: 'secondary.main', px: 4, py: 1.5 }}
            >
              Explore Menu
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ borderColor: 'white', color: 'white', px: 4, py: 1.5 }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
