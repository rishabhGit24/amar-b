```typescript
import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { ArrowForward, Star, Speed, Security, LocalCafe, Spa, People } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header />

      {/* 1. Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)', // Vibrant green gradient for a fresh, natural feel
          color: 'white',
          py: { xs: 8, md: 16 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': { // Subtle pattern overlay for added texture and visual depth
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.2,
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h1"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Our Journey: Crafting Moments, One Cup at a Time
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.95,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            Welcome to the heart of our passion. At [Coffee Shop Name], we believe coffee is more than just a beverage; it's an experience, a ritual, and a catalyst for connection. Our story began over a decade ago with a simple dream: to create a welcoming space where exceptional coffee meets genuine community. From the meticulous sourcing of the finest beans from sustainable farms around the globe to the artistry of our skilled baristas, every step of our process is infused with dedication and love. We invite you to explore our commitment to quality, sustainability, and the vibrant culture we've cultivated. Discover the unique blend of tradition and innovation that defines every sip and every moment spent with us. We are not just serving coffee; we are serving stories, fostering friendships, and building a sanctuary where everyone feels at home. Our commitment extends beyond the cup, reaching into the communities we source from and the neighborhoods we serve, ensuring a positive impact at every touchpoint.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              bgcolor: 'secondary.dark', // Using a darker secondary color for strong contrast
              '&:hover': {
                bgcolor: 'secondary.main',
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease-in-out',
              },
              borderRadius: '50px',
              boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
            }}
          >
            Explore Our Values
          </Button>
        </Container>
      </Box>

      {/* 2. Components Section - AboutSection */}
      {/* This section integrates the provided AboutSection component */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <AboutSection /> {/* Placeholder for the mandatory AboutSection component */}
        </Container>
      </Box>

      {/* 3. Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f0f8f0' }}> {/* Soft, light green background */}
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: { xs: 6, md: 8 },
              fontWeight: 700,
              color: 'primary.dark',
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            What Makes Our Coffee Shop Truly Special
          </Typography>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 3,
                  borderRadius: '16px',
                  boxShadow: '0px 10px 30px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0px 15px 40px rgba(0,0,0,0.15)',
                  },
                  bgcolor: 'white',
                }}
              >
                <CardContent>
                  <LocalCafe sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'primary.dark' }}>
                    Ethically Sourced, Premium Beans
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary',