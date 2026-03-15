import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { ArrowForward, Star, Speed, Security } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuSection from '../components/MenuSection';
import CallToActionSection from '../components/CallToActionSection';

const MenuPage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#f5f5f5' }}> {/* Overall page background */}
      <Header />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)', // Fresh green gradient
        color: 'white',
        py: 12,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("https://source.unsplash.com/random/1600x900/?coffee-beans,latte-art") no-repeat center center',
          backgroundSize: 'cover',
          opacity: 0.15,
          zIndex: 0,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h1" sx={{ mb: 3, fontWeight: 700, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Savor Every Moment: Explore Our Exquisite Menu
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
            Step into a world where every sip and every bite tells a story of passion, quality, and unparalleled taste. Our meticulously crafted menu features an extensive selection of artisanal coffees, refreshing beverages, and delectable food items, all prepared with the freshest ingredients and a touch of culinary artistry. Whether you're seeking a robust morning espresso, a comforting afternoon tea, or a delightful meal to share, our offerings are designed to elevate your everyday experience. Discover new favorites and indulge in timeless classics, all within a welcoming atmosphere that invites you to relax and enjoy.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              bgcolor: '#ffeb3b', // Bright yellow for contrast
              color: '#333',
              fontWeight: 700,
              '&:hover': {
                bgcolor: '#fdd835',
                transform: 'translateY(-2px)',
              },
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            View Our Full Menu
          </Button>
        </Container>
      </Box>

      {/* Menu Section (Core Content) */}
      <MenuSection />

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#e0f2f7' }}> {/* Light blue background */}
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" sx={{ mb: 8, fontWeight: 700, color: '#263238' }}>
            Why Our Cafe Stands Apart
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 3,
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                },
                bgcolor: 'white'
              }}>
                <CardContent>
                  <Star sx={{ fontSize: 60, color: '#ffc107', mb: 2 }} />
                  <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Artisan Craftsmanship
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7 }}>
                    Every cup of coffee and every dish served at our cafe is a testament to artisan craftsmanship. We meticulously select premium, ethically sourced coffee beans from the world's finest regions, ensuring a rich and complex flavor profile in every brew. Our skilled baristas are true artists, trained in the delicate science of extraction and the beautiful art of latte design, guaranteeing a perfect cup every time. From the precise grind to the ideal water temperature, no detail is overlooked. Our culinary team applies the same dedication to our food, preparing each item with care, passion, and an unwavering commitment to quality ingredients and authentic flavors.
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
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                },
                bgcolor: 'white'
              }}>
                <CardContent>
                  <Speed sx={{ fontSize: 60, color: '#2196f3', mb: 2 }} />
                  <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Freshly Prepared Daily
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7 }}>
                    We believe that the freshest ingredients make the most delicious food. That's why our kitchen works tirelessly each day to prepare every item on our menu from scratch. Our pastries are baked fresh every morning, filling the air with irresistible aromas. Our sandwiches and salads are assembled with crisp, locally sourced produce whenever possible, ensuring vibrant flavors and nutritional value. We prioritize seasonal ingredients to bring you the best of what nature offers, adapting our specials to highlight peak freshness. This commitment to daily preparation means you always receive food that is not only incredibly tasty but also wholesome and made with genuine care.
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
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                },
                bgcolor: 'white'
              }}>
                <CardContent>
                  <Security sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                  <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Sustainable & Ethical Sourcing
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.7 }}>
                    Our commitment extends beyond taste to encompass responsibility. We are deeply dedicated to sustainable and ethical sourcing practices for all our ingredients. This means partnering with farmers and suppliers who share our values, ensuring fair wages, environmentally friendly cultivation methods, and animal welfare. Our coffee beans are often certified fair trade or direct trade, supporting coffee-growing communities. By choosing our cafe, you're not just enjoying exceptional food and drink; you're also contributing to a more sustainable and equitable food system. We believe in transparency and making choices that benefit both our customers and the planet.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call-to-Action Section */}
      <Box sx={{
        background: 'linear-gradient(45deg, #ff7043 30%, #ff9800 90%)', // Warm orange gradient
        color: 'white',
        py: 10,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700, textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
            Ready to Indulge?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9, lineHeight: 1.6 }}>
            Whether you're planning a quick coffee break, a leisurely lunch, or need catering for your next event, we're here to serve you. Our friendly team is always ready to help you navigate our diverse menu and find exactly what you're craving. Don't hesitate to reach out for special requests or to learn more about our seasonal offerings. We look forward to welcoming you and making your visit a truly memorable one.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                bgcolor: '#424242', // Dark grey for contrast
                color: 'white',
                '&:hover': {
                  bgcolor: '#616161',
                  transform: 'translateY(-2px)',
                },
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              Visit Us Today
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                },
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              Order Online
            </Button>
          </Stack>
          <Typography variant="body1" sx={{ mt: 5, opacity: 0.8 }}>
            Contact us: (123) 456-7890 | info@ourcafe.com
          </Typography>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default MenuPage;