import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { ArrowForward, Star, Speed, Security } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturedItemsSection from '../components/FeaturedItemsSection';
import TestimonialsSection from '../components/TestimonialsSection';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Header />

      {/* Hero Section - Using the provided HeroSection component */}
      <HeroSection
        title="Experience the Art of Coffee at Brew Haven: Your Daily Escape"
        subtitle="Step into Brew Haven, where every cup tells a story of passion, quality, and community. We meticulously source the finest, ethically grown beans from renowned coffee regions around the globe, ensuring a sustainable and superior product. Our expert baristas, true artisans of their craft, roast these beans to perfection daily, unlocking complex aromas and rich flavors that are simply unparalleled. We then craft exquisite beverages, from classic espressos to innovative signature lattes, all designed to awaken your senses and elevate your day. Beyond just exceptional coffee, we offer a warm, inviting atmosphere, a sanctuary from the bustling world, where you can relax, connect with friends, dive into a good book, or simply enjoy a moment of quiet contemplation. Discover our unique, seasonal blends, delightful array of freshly baked pastries, and a steadfast commitment to providing an unparalleled coffee experience that goes far beyond the ordinary. Join us and make Brew Haven your cherished daily ritual, a place where exceptional taste meets genuine hospitality, creating lasting memories one delightful sip at a time, fostering a true sense of belonging within our vibrant community."
        ctaText="Explore Our Menu"
        ctaLink="/menu"
      />

      {/* Featured Items Section - Using the provided FeaturedItemsSection component */}
      <FeaturedItemsSection />

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" sx={{ mb: 6, fontWeight: 700, color: '#4a2c2a' }}>
            Why Brew Haven Stands Apart
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
                  },
                  background: 'linear-gradient(145deg, #fdfbfb 0%, #ebedee 100%)',
                }}
              >
                <CardContent>
                  <Box sx={{ color: '#a0522d', mb: 2 }}>
                    <Star sx={{ fontSize: 60 }} />
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600, color: '#6d4c41' }}>
                    Masterful Roasting & Ethical Sourcing
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.7 }}>
                    At Brew Haven, our commitment to excellence begins long before the first sip. We meticulously select only the highest quality, ethically sourced coffee beans from sustainable farms across the world's most celebrated coffee-growing regions, including the lush highlands of Ethiopia, the volcanic soils of Colombia, and the vibrant plantations of Brazil. Our expert roasters then apply their profound knowledge and passion, employing precise techniques to bring out the unique characteristics and optimal flavor profiles of each bean. This artisanal approach ensures that every batch is roasted to perfection, delivering a consistently rich, aromatic, and unforgettable coffee experience that truly honors the bean's origin and the hard work of its growers. We believe in transparency and sustainability, ensuring fair practices from farm to cup, making your coffee not just delicious, but also a choice you can feel good about.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
                  },
                  background: 'linear-gradient(145deg, #fdfbfb 0%, #ebedee 100%)',
                }}
              >
                <CardContent>
                  <Box sx={{ color: '#a0522d', mb: 2 }}>
                    <Speed sx={{ fontSize: 60 }} />
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600, color: '#6d4c41' }}>
                    Precision Craftsmanship in Every Cup
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.7 }}>
                    Our baristas are more than just coffee makers; they are dedicated artists and connoisseurs, rigorously trained in the intricate science and art of coffee preparation. From mastering the perfect espresso extraction – achieving that elusive golden crema – to expertly steaming milk for velvety lattes and intricate latte art, their skill is evident in every beverage. They understand the nuances of grind size, water temperature, and brewing time, ensuring that whether you order a classic Americano, a complex pour-over, or a refreshing cold brew, it is prepared with absolute precision and care. This dedication to craftsmanship guarantees a consistently superior taste and a visually appealing presentation, transforming your daily coffee into a moment of pure indulgence and a testament to the highest standards of barista artistry.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
                  },
                  background: 'linear-gradient(145deg, #fdfbfb 0%, #ebedee 100%)',
                }}
              >
                <CardContent>
                  <Box sx={{ color: '#a0522d', mb: 2 }}>
                    <Security sx={{ fontSize: 60 }} />
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600, color: '#6d4c41' }}>
                    A Haven of Comfort and Connection
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#757575', lineHeight: 1.7 }}>
                    Brew Haven is designed to be more than just a coffee shop; it's a vibrant community hub and a tranquil retreat. Our thoughtfully curated interior features warm lighting, comfortable seating, and a soothing color palette, creating an inviting atmosphere perfect for productivity, relaxation, or lively conversation. Whether you're seeking a quiet corner to work, a cozy spot for a first date, or a spacious table for a group gathering, our space adapts to your needs. We foster a sense of belonging, encouraging connections and shared experiences over exceptional coffee. Enjoy our complimentary high-speed Wi-Fi, ambient background music, and the friendly smiles of our staff, all contributing to an environment where you feel welcomed, valued, and truly at home. It's the perfect backdrop for making memories, one delightful visit at a time.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section - Using the provided TestimonialsSection component */}
      <TestimonialsSection />

      {/* Call-to-Action Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #4a2c2a 30%, #a0522d 90%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
            Your Perfect Coffee Moment Awaits: Visit Brew Haven Today!
          </Typography>
          <Typography variant="h5" sx={{ mb: 5, opacity: 0.9, maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}>
            Don't just drink coffee; experience it. At Brew Haven, we invite you to step away from the ordinary and immerse yourself in a world where every detail is crafted for your enjoyment. From the rich aroma that greets you at the door to the last lingering taste of your perfectly brewed beverage, we promise an experience that delights all your senses. Whether you're a connoisseur seeking rare single-origin beans, a student needing a quiet study spot, or simply looking for a friendly face and a comforting cup, Brew Haven is your destination. Our friendly team is eager to welcome you and guide you through our extensive menu of handcrafted drinks and delectable treats. Make your day extraordinary – discover your new favorite coffee shop and become a part of the Brew Haven family. We are conveniently located and ready to serve you with a smile and the finest coffee in town.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: 5,
                py: 1.8,
                fontSize: '1.15rem',
                bgcolor: '#f5f5f5',
                color: '#4a2c2a',
                fontWeight: 700,
                '&:hover': { bgcolor: '#e0e0e0' },
              }}
            >
              Explore Our Menu
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.8,
                fontSize: '1.15rem',
                color: 'white',
                borderColor: 'white',
                fontWeight: 700,
                '&:hover': { borderColor: '#e0e0e0', color: '#e0e0e0' },
              }}
            >
              Find Our Location
            </Button>
          </Stack>
          <Typography variant="body1" sx={{ mt: 4, opacity: 0.8 }}>
            Open Daily: 7 AM - 7 PM | Call Us: (555) 123-4567 | Email: info@brewhaven.com
          </Typography>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;