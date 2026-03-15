```typescript
import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { ArrowForward, Star, Speed, Security } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import TeamSection from '../components/TeamSection';

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Component */}
      <Header />

      {/* 1. Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)', // Fresh, coffee-leaf inspired gradient
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': { // Subtle background pattern for texture
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.2,
          zIndex: 0,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h1" sx={{ mb: 3, fontWeight: 700, fontSize: { xs: '2.5rem', md: '4rem' } }}>
            Our Journey: Crafting Moments, One Bean at a Time
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: '800px', mx: 'auto', fontSize: { xs: '1rem', md: '1.5rem' } }}>
            Welcome to the heart of our coffee passion. From humble beginnings, our vision has always been to create more than just a coffee shop; we aimed to cultivate a vibrant community hub where exceptional coffee meets genuine connection. Every cup tells a story of dedication, ethical sourcing, and a relentless pursuit of perfection. We believe that great coffee has the power to inspire, comfort, and bring people together, and it's this philosophy that guides every decision we make, from selecting the finest beans to the final pour. Join us as we share our commitment to quality, sustainability, and the art of coffee.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              bgcolor: 'secondary.main', // A contrasting color, e.g., a rich brown or deep purple
              color: 'white',
              '&:hover': {
                bgcolor: 'secondary.dark',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Discover Our Philosophy
          </Button>
        </Container>
      </Box>

      {/* 2. Components Section */}
      {/* These components are assumed to be fully implemented and styled externally */}
      <AboutSection />
      <TeamSection />

      {/* 3. Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" sx={{ mb: { xs: 6, md: 8 }, fontWeight: 700, color: 'primary.dark' }}>
            Our Core Values & What Makes Us Unique
          </Typography>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Feature Card 1: Ethical Sourcing */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 3,
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                },
                bgcolor: 'white',
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    <Star sx={{ fontSize: 60 }} />
                  </Box>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Ethical & Sustainable Sourcing
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    Our commitment begins at the source. We meticulously select our beans from farms that uphold the highest standards of ethical labor practices and environmental stewardship. We forge direct relationships with growers, ensuring fair wages and sustainable farming methods that protect both the planet and the livelihoods of coffee farmers. This direct trade approach not only guarantees exceptional quality but also fosters transparency and trust throughout our supply chain. Every bean we roast is a testament to our dedication to a better, more equitable coffee world, allowing you to enjoy your cup with a clear conscience, knowing its journey was one of integrity and care.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature Card 2: Artisanal Craftsmanship */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 3,
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                },
                bgcolor: 'white',
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ color: 'secondary.main', mb: 2 }}>
                    <Speed sx={{ fontSize: 60 }} /> {/* Speed can imply efficiency in roasting/brewing, or freshness */}
                  </Box>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'secondary.main' }}>
                    Artisanal Roasting & Brewing
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    The journey from bean to cup is an art form we cherish. Our master roasters employ precise techniques, carefully monitoring each batch to unlock the unique flavor profiles inherent in every origin. This meticulous process ensures a consistent, rich, and aromatic experience in every brew. Our skilled baristas then take over, transforming these perfectly roasted beans into exquisite beverages with precision and passion. From the ideal grind to the perfect extraction, every step is executed with an unwavering commitment to quality, ensuring that each sip delivers a moment of pure coffee bliss, reflecting years of expertise and dedication.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature Card 3: Community & Experience */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 3,
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                },
                bgcolor: 'white',
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ color: 'info.main', mb: 2 }}>
                    <Security sx={{ fontSize: 60 }} /> {/* Security can imply a safe, welcoming community space */}
                  </Box>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'info.main' }}>
                    A Welcoming Community Hub
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    More than just a place to grab coffee, our shop is designed to be a sanctuary, a vibrant meeting point where friendships blossom and ideas flourish. We've cultivated an atmosphere that is both cozy and inspiring, perfect for quiet contemplation, lively conversations, or productive work sessions. Our friendly team is dedicated to providing exceptional service, making every visitor feel like family. We host local events, support community initiatives, and strive to be a positive force in the neighborhood. Come for the coffee, stay for the connection – experience the warmth and camaraderie that defines our unique coffee community.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. Call-to-Action Section */}
      <Box sx={{
        background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)', // Green gradient
        color: 'white',
        py: { xs: 8, md: 10 },
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' } }}>
            Experience the Difference Today
          </Typography>
          <Typography variant="body1" sx={{ mb: 5, opacity: 0.9, maxWidth: '700px', mx: 'auto', fontSize: { xs: '1rem', md: '1.15rem' } }}>
            We invite you to visit us and immerse yourself in the rich aromas and welcoming ambiance of