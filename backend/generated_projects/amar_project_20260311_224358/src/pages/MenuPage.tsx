```typescript
import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { ArrowForward, Star, Speed, Security } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CallToActionSection from '../components/CallToActionSection';
import MenuSection from '../components/MenuSection';

const MenuPage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#f8f8f8', minHeight: '100vh' }}>
      <Header />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD166 100%)', // Warm, inviting gradient
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': { // Subtle background pattern/texture
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
          zIndex: 1,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h1" sx={{ mb: 3, fontWeight: 800, fontSize: { xs: '2.5rem', md: '4rem' }, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Discover Our Exquisite Menu: A Culinary Journey Awaits
          </Typography>
          <Typography variant="h5" sx={{ mb: 5, opacity: 0.95, maxWidth: '800px', mx: 'auto', lineHeight: 1.6, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
            Step into a world where every sip and every bite tells a story of passion, quality, and unparalleled flavor. Our meticulously crafted menu offers an extensive selection of artisanal coffees, from rich espressos to delicate pour-overs, alongside a delightful array of gourmet pastries baked fresh daily. Explore our hearty breakfast options, satisfying lunch specials, and delectable desserts, all prepared with the finest, locally sourced ingredients whenever possible. Whether you're seeking a quick caffeine fix, a leisurely brunch, or a sweet escape, our diverse offerings are designed to tantalize your taste buds and create memorable moments. We believe in providing an experience that goes beyond just food and drink, fostering a vibrant atmosphere where community thrives and every visit feels like a special occasion.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 5,
              py: 1.8,
              fontSize: '1.2rem',
              bgcolor: '#4CAF50', // A vibrant green for the button
              '&:hover': {
                bgcolor: '#388E3C',
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease-in-out',
              },
              borderRadius: '50px',
              boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
            }}
          >
            Explore Our Full Menu
          </Button>
        </Container>
      </Box>

      {/* Menu Section - Using the provided component */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h2" align="center" sx={{ mb: 6, fontWeight: 700, color: 'primary.dark', textTransform: 'uppercase', letterSpacing: 1.5 }}>
          Our Signature Offerings
        </Typography>        
        <MenuSection /> {/* This component is expected to display the actual menu items */}
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#E3F2FD', py: { xs: 8, md: 12 } }}> {/* Light blue background */}
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" sx={{ mb: 8, fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Why Our Menu Stands Out
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 3,
                borderRadius: '16px',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0px 15px 40px rgba(0,0,0,0.2)',
                },
                bgcolor: 'white',
              }}>
                <CardContent>
                  <Star sx={{ fontSize: 60, color: '#FFC107', mb: 2 }} /> {/* Gold star icon */}
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    Freshly Brewed Excellence
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    At the heart of our establishment lies an unwavering commitment to coffee perfection. We meticulously source premium, ethically grown beans from renowned regions across the globe, ensuring each cup delivers a rich, aromatic, and unforgettable experience. Our skilled baristas, true artisans of their craft, employ precise brewing techniques, from the delicate pour-over to the robust espresso, extracting the nuanced flavors that make each blend unique. We offer a diverse range of options, including single-origin selections, signature blends, and seasonal specials, alongside a variety of milk alternatives and customizable additions. Every coffee is prepared with passion and precision, guaranteeing a consistently exceptional taste that will awaken your senses and elevate your day.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 3,
                borderRadius: '16px',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0px 15px 40px rgba(0,0,0,0.2)',
                },
                bgcolor: 'white',
              }}>
                <CardContent>
                  <Speed sx={{ fontSize: 60, color: '#2196F3', mb: 2 }} /> {/* Blue speed icon */}
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    Gourmet Culinary Delights
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    Beyond our exceptional beverages, our kitchen crafts a delectable array of gourmet food items designed to complement your drink or stand alone as a satisfying meal. Our menu features an enticing selection of freshly baked pastries, from flaky croissants to decadent muffins, perfect for a morning treat. For lunch, indulge in our artisanal sandwiches, vibrant salads made with crisp, seasonal vegetables, and comforting hot meals prepared daily. We prioritize fresh, high-quality ingredients, often sourced from local farms and suppliers, ensuring every dish is bursting with flavor and goodness. We also cater to various dietary preferences, offering a thoughtful selection of vegetarian, vegan, and gluten-free options, so everyone can find something delightful to savor.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: '