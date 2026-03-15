import React from 'react';
import { Box, Container, Typography, Button, Card, Grid } from '@mui/material';
import { LocalPizza, Star, RestaurantMenu, AccessTime, DeliveryDining, LocationOn } from '@mui/icons-material';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          textAlign: 'center',
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
          borderRadius: 2,
          mb: 6,
          boxShadow: 3,
        }}
      >
        <LocalPizza sx={{ fontSize: 80, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h1" sx={{ mb: 2, fontWeight: 700, color: 'secondary.main' }}>
          Welcome to Primo Pizzeria
        </Typography>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 400, color: 'primary.contrastText' }}>
          Authentic Flavors, Unforgettable Moments
        </Typography>
        <Typography variant="body1" sx={{ mb: 5, lineHeight: 1.8, maxWidth: '800px', mx: 'auto' }}>
          At Primo Pizzeria, we believe in crafting more than just pizzas; we create experiences. From our hand-tossed dough,
          made fresh daily, to our rich, slow-simmered tomato sauce and premium, locally sourced toppings, every ingredient
          is chosen with care. Our passion for traditional Italian methods, combined with a touch of modern culinary artistry,
          ensures that each bite transports you straight to the heart of Italy. Whether you are craving a classic Margherita,
          a robust Pepperoni, or one of our unique gourmet creations, Primo Pizzeria promises a meal that delights the senses
          and brings people together. Join us for a taste of perfection, where quality and flavor are always our top priorities.
        </Typography>
        <Button variant="contained" color="secondary" sx={{ px: 5, py: 1.8, mr: 2, fontSize: '1.1rem', boxShadow: 4 }}>
          Order Online Now
        </Button>
        <Button variant="outlined" color="secondary" sx={{ px: 5, py: 1.8, fontSize: '1.1rem', borderColor: 'secondary.main', color: 'secondary.main', '&:hover': { borderColor: 'secondary.dark' } }}>
          View Our Full Menu
        </Button>
      </Box>

      {/* Our Story / About Us Section */}
      <Box sx={{ py: 6, mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 600, color: 'primary.dark' }}>
          Our Story: A Legacy of Taste
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, maxWidth: '900px', mx: 'auto', color: 'text.secondary' }}>
          Primo Pizzeria began with a simple dream: to bring the authentic taste of Naples to our community. Founded by the Rossi family,
          who immigrated from Italy with generations of culinary secrets, our pizzeria is a testament to their unwavering dedication
          to quality and tradition. Every recipe has been passed down, perfected over decades, ensuring that the essence of true
          Italian pizza is preserved. We pride ourselves on using only the freshest, highest-quality ingredients, from the finest
          "00" flour for our dough to the ripest San Marzano tomatoes for our sauce. Our commitment extends beyond the kitchen;
          we strive to create a warm, inviting atmosphere where friends and family can gather, share laughter, and enjoy exceptional food.
          It is more than just a meal; it is an experience rooted in heritage and passion.
        </Typography>
        <Button variant="text" sx={{ color: 'primary.main', fontSize: '1rem' }}>
          Learn More About Us
        </Button>
      </Box>

      {/* Menu Highlights Section */}
      <Box sx={{ py: 6, mb: 6, backgroundColor: 'grey.100', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h2" sx={{ mb: 5, textAlign: 'center', fontWeight: 600, color: 'primary.dark' }}>
          Signature Pizzas & Delights
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 3 }}>
              <LocalPizza sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'primary.dark' }}>
                The Classic Margherita
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', flexGrow: 1 }}>
                A timeless masterpiece featuring fresh mozzarella, vibrant San Marzano tomato sauce, fragrant basil, and a drizzle of extra virgin olive oil. Simple perfection.
              </Typography>
              <Typography variant="h6" sx={{ color: 'secondary.dark', fontWeight: 700 }}>
                $18.99
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 3 }}>
              <Star sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'primary.dark' }}>
                Primo's Gourmet Special
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', flexGrow: 1 }}>
                Our chef's special blend of prosciutto, arugula, cherry tomatoes, and shaved parmesan on a white garlic sauce base. A true culinary adventure.
              </Typography>
              <Typography variant="h6" sx={{ color: 'secondary.dark', fontWeight: 700 }}>
                $24.99
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 3 }}>
              <RestaurantMenu sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'primary.dark' }}>
                Spicy Diavola
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', flexGrow: 1 }}>
                For those who love a kick! Spicy salami, chili flakes, mozzarella, and our signature tomato sauce. A fiery delight.
              </Typography>
              <Typography variant="h6" sx={{ color: 'secondary.dark', fontWeight: 700 }}>
                $20.99
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: 6, mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 5, fontWeight: 600, color: 'primary.dark' }}>
          Why Primo Pizzeria?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 2, height: '100%' }}>
              <AccessTime sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'primary.dark' }}>
                Freshly Prepared
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Every dish is crafted with the freshest ingredients, prepared daily to ensure peak flavor and quality. We never compromise on freshness.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 2, height: '100%' }}>
              <DeliveryDining sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'primary.dark' }}>
                Fast & Reliable Delivery
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enjoy your favorite Primo Pizzeria dishes delivered hot and fresh right to your doorstep. Quick service, every time.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 2, height: '100%' }}>
              <LocationOn sx={{ fontSize: 50, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'primary.dark' }}>
                Cozy Dine-In Experience
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Our restaurant offers a warm and inviting atmosphere, perfect for family dinners, romantic evenings, or casual get-togethers.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action / Reservation Section */}
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 2,
          mb: 6,
          boxShadow: 3,
        }}
      >
        <Typography variant="h2" sx={{ mb: 3, fontWeight: 700, color: 'primary.contrastText' }}>
          Experience Primo Pizzeria Today!
        </Typography>
        <Typography variant="body1" sx={{ mb: 5, lineHeight: 1.8, maxWidth: '800px', mx: 'auto', color: 'primary.contrastText' }}>
          Whether you are planning a special celebration, a casual dinner with loved ones, or simply craving the best pizza in town,
          Primo Pizzeria is ready to serve you. Our friendly staff and authentic Italian cuisine promise an unforgettable dining experience.
          Do not miss out on the true taste of Italy. Make a reservation or place your order now and let us bring the magic of Primo Pizzeria to you.
          We look forward to welcoming you!
        </Typography>
        <Button variant="contained" color="secondary" sx={{ px: 5, py: 1.8, mr: 2, fontSize: '1.1rem', boxShadow: 4 }}>
          Make a Reservation
        </Button>
        <Button variant="outlined" color="secondary" sx={{ px: 5, py: 1.8, fontSize: '1.1rem', borderColor: 'secondary.main', color: 'secondary.main', '&:hover': { borderColor: 'secondary.dark' } }}>
          Find Our Location
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;