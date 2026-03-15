import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { ArrowForward, Star, Speed, Security } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
// HeroSection, FeatureGrid, CallToActionSection are conceptual sections to be built within HomePage,
// not imported components to be rendered directly, based on the detailed content requirements.

const HomePage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#fdfaf6' }}> {/* Overall page background */}
      <Header />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4a2c2a 0%, #7b5e57 100%)', // Deep coffee tones
        color: 'white',
        py: { xs: 8, md: 16 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': { // Subtle background pattern
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 0,
          opacity: 0.8,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h1" sx={{
            mb: 3,
            fontWeight: 800,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            letterSpacing: '0.05em'
          }}>
            Awaken Your Senses: The Perfect Brew Awaits
          </Typography>
          <Typography variant="h5" sx={{
            mb: 4,
            opacity: 0.9,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
          }}>
            Step into a world where every cup tells a story. At "The Daily Grind," we meticulously source the finest beans from around the globe, ensuring a rich, aromatic experience with every sip. Our passionate baristas craft each beverage with precision and care, transforming simple ingredients into liquid artistry. Whether you crave the bold intensity of an espresso, the creamy comfort of a latte, or the refreshing zest of a cold brew, our diverse menu is designed to delight every palate. We believe coffee is more than just a drink; it's a ritual, a moment of peace, and a catalyst for connection. Join us and discover your new favorite escape.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              fontSize: { xs: '1rem', md: '1.2rem' },
              bgcolor: '#e0a96d', // Warm gold accent
              color: '#4a2c2a',
              fontWeight: 700,
              borderRadius: '50px',
              boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
              '&:hover': {
                bgcolor: '#f0c28d',
                transform: 'translateY(-3px)',
                boxShadow: '0px 12px 25px rgba(0,0,0,0.3)',
              }
            }}
          >
            Explore Our Menu
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fdfaf6' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" sx={{
            mb: { xs: 6, md: 8 },
            fontWeight: 700,
            color: '#4a2c2a',
            fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
            textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
          }}>
            Why Choose The Daily Grind?
          </Typography>
          <Typography variant="body1" align="center" sx={{
            mb: { xs: 6, md: 10 },
            maxWidth: '900px',
            mx: 'auto',
            color: '#6d4c41',
            fontSize: { xs: '1rem', md: '1.15rem' },
            lineHeight: 1.7
          }}>
            At The Daily Grind, we are more than just a coffee shop; we are a community hub built on a foundation of quality, passion, and sustainability. Our commitment extends beyond the cup, encompassing every aspect of your experience from the moment you walk through our doors. We pride ourselves on creating an inviting atmosphere where you can relax, work, or connect with friends, all while enjoying exceptional coffee and delightful treats. Discover the core values that make us a beloved destination for coffee aficionados and casual drinkers alike.
          </Typography>

          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: { xs: 2, md: 4 },
                borderRadius: '16px',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 15px 40px rgba(0,0,0,0.15)',
                },
                bgcolor: '#fff'
              }}>
                <CardContent>
                  <Box sx={{ color: '#e0a96d', mb: 3, textAlign: 'center' }}>
                    <Star sx={{ fontSize: { xs: 60, md: 70 } }} />
                  </Box>
                  <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 700, color: '#4a2c2a' }}>
                    Crafted with Passion
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ color: '#6d4c41', lineHeight: 1.7 }}>
                    Our journey begins with the finest, ethically sourced beans from renowned coffee regions across the globe. Each batch is carefully selected for its unique flavor profile and roasted to perfection in small quantities to ensure optimal freshness and aroma. Our highly skilled baristas, true artisans of their craft, then transform these exceptional beans into exquisite beverages, paying meticulous attention to every detail from grind size to milk texture. This dedication to quality and passion for coffee ensures that every cup you receive is a masterpiece, a testament to our unwavering commitment to excellence.
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
                p: { xs: 2, md: 4 },
                borderRadius: '16px',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 15px 40px rgba(0,0,0,0.15)',
                },
                bgcolor: '#fff'
              }}>
                <CardContent>
                  <Box sx={{ color: '#e0a96d', mb: 3, textAlign: 'center' }}>
                    <Speed sx={{ fontSize: { xs: 60, md: 70 } }} />
                  </Box>
                  <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 700, color: '#4a2c2a' }}>
                    Speedy Service, Fresh Taste
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ color: '#6d4c41', lineHeight: 1.7 }}>
                    We understand that your time is precious, especially during a busy day. That's why we've optimized our service to be both efficient and friendly, ensuring you get your perfect brew without unnecessary delays. Our baristas are trained to work swiftly and accurately, maintaining the highest standards of quality even during peak hours. We utilize state-of-the-art equipment and streamlined workflows to minimize wait times, so you can enjoy your freshly prepared coffee exactly when you need it. Experience the perfect balance of speed and uncompromising freshness, every single visit.
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
                p: { xs: 2, md: 4 },
                borderRadius: '16px',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 15px 40px rgba(0,0,0,0.15)',
                },
                bgcolor: '#fff'
              }}>
                <CardContent>
                  <Box sx={{ color: '#e0a96d', mb: 3, textAlign: 'center' }}>
                    <Security sx={{ fontSize: { xs: 60, md: 70 } }} />
                  </Box>
                  <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 700, color: '#4a2c2a' }}>
                    Sustainable & Ethical Sourcing
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ color: '#6d4c41', lineHeight: 1.7 }}>
                    Our commitment extends beyond taste to encompass responsibility. We are dedicated to sourcing our coffee beans through sustainable and ethical practices, ensuring fair wages for farmers and minimizing environmental impact. We partner with suppliers who share our values, promoting biodiversity and supporting local communities in coffee-growing regions. By choosing The Daily Grind, you're not just enjoying a delicious cup of coffee; you're contributing to a more equitable and sustainable future for the entire coffee industry. Taste the difference that conscious sourcing makes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call-to-Action Section */}
      <Box sx={{
        background: 'linear-gradient(45deg, #7b5e57 0%, #4a2c2a 100%)', // Reverse gradient for contrast
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': { // Subtle background pattern
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 0,
          opacity: 0.8,
        }
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" sx={{
            mb: 3,
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '3rem', md: '3.8rem' },
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
          }}>
            Ready for Your Perfect Coffee Moment?
          </Typography>
          <Typography variant="body1" sx={{
            mb: 6,
            opacity: 0.9,
            maxWidth: '700px',
            mx: 'auto',
            lineHeight: 1.7,
            fontSize: { xs: '1rem', md: '1.15rem' }
          }}>
            Whether you're looking for a quiet corner to work, a vibrant spot to meet friends, or simply the best coffee in town, The Daily Grind is your destination. We invite you to experience our unique blend of exceptional quality, warm hospitality, and inviting ambiance. Don't just drink coffee; savor the experience. Visit us today or place an order for pickup!
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '1rem', md: '1.2rem' },
                bgcolor: '#e0a96d',
                color: '#4a2c2a',
                fontWeight: 700,
                borderRadius: '50px',
                boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
                '&:hover': {
                  bgcolor: '#f0c28d',
                  transform: 'translateY(-3px)',
                  boxShadow: '0px 12px 25px rgba(0,0,0,0.3)',
                },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Find Our Location
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '1rem', md: '1.2rem' },
                color: '#e0a96d',
                borderColor: '#e0a96d',
                fontWeight: 700,
                borderRadius: '50px',
                transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
                '&:hover': {
                  bgcolor: 'rgba(224, 169, 109, 0.1)',
                  borderColor: '#f0c28d',
                  transform: 'translateY(-3px)',
                  boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
                },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Order Online
            </Button>
          </Stack>
          <Typography variant="h6" sx={{ mb: 1, color: '#fdfaf6', fontWeight: 600 }}>
            Contact Us:
          </Typography>
          <Typography variant="body1" sx={{ color: '#fdfaf6', opacity: 0.9 }}>
            Email: info@thedailygrind.com | Phone: (123) 456-7890
          </Typography>
          <Typography variant="body2" sx={{ color: '#fdfaf6', opacity: 0.7, mt: 1 }}>
            123 Coffee Lane, Brewville, CA 90210
          </Typography>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;