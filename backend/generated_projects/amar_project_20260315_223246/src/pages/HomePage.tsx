import React from 'react';
import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const featuredPizzas = [
  {
    name: 'Margherita Classica',
    description: 'San Marzano tomato sauce, Fior di Latte mozzarella, fresh basil, extra virgin olive oil.',
    price: '$18',
    badge: 'Best Seller',
  },
  {
    name: 'Truffle Mushroom Bianca',
    description: 'Creamy ricotta base, roasted mushrooms, truffle oil drizzle, parmesan flakes.',
    price: '$24',
    badge: 'Chef Special',
  },
  {
    name: 'Diavola Piccante',
    description: 'Spicy salami, smoked mozzarella, crushed chili, oregano, and roasted peppers.',
    price: '$22',
    badge: 'Spicy Favorite',
  },
];

const HomePage: React.FC = () => {
  return (
    <Box>
      <Header />

      <Box
        sx={{
          background: 'radial-gradient(circle at top left, #E9B44C 0%, #B23A48 45%, #5F3025 100%)',
          color: 'white',
          pt: 12,
          pb: 10,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip label="Since 1985 • Wood Fired" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.18)', color: 'white' }} />
              <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.8rem' } }}>
                Brooklyn's Neighborhood Pizzeria, Crafted With Heart
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, maxWidth: 680, opacity: 0.95, lineHeight: 1.7 }}>
                Bella Napoli Pizzeria serves hand-stretched dough, slow-simmered sauces, and premium ingredients imported from Italy.
                Whether you are joining us for a cozy dinner, family celebration, or late-night slice run, every order is made fresh,
                baked in our stone oven, and served with true neighborhood hospitality.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={RouterLink} to="/menu" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />}>
                  Order Now
                </Button>
                <Button component={RouterLink} to="/contact" variant="outlined" sx={{ borderColor: 'white', color: 'white' }}>
                  Book a Table
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(5px)' }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Visit Bella Napoli</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>456 Little Italy Ave, Brooklyn, NY</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>(718) 555-PIZZA</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>Mon-Thu 11:00 AM-10:00 PM • Fri-Sat 11:00 AM-11:30 PM • Sun 12:00 PM-9:00 PM</Typography>
                  <Button href="tel:+17185557499" variant="contained" color="primary">Call for Pickup</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 9 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>Featured Pizzas</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 760 }}>
          Crowd favorites built from authentic recipes. Add garlic knots, tiramisu, and a house soda to complete your meal.
        </Typography>
        <Grid container spacing={3}>
          {featuredPizzas.map((pizza) => (
            <Grid key={pizza.name} item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Chip label={pizza.badge} color="secondary" sx={{ mb: 1.5 }} />
                  <Typography variant="h5" sx={{ mb: 1 }}>{pizza.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 62 }}>
                    {pizza.description}
                  </Typography>
                  <Typography variant="h6" color="primary.main">{pizza.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card><CardContent><LocalFireDepartmentIcon color="primary" /><Typography variant="h6" sx={{ mt: 1 }}>Stone Oven Flavor</Typography><Typography variant="body2" color="text.secondary">Our oven runs hot all day for that blistered crust and airy bite.</Typography></CardContent></Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card><CardContent><AccessTimeIcon color="primary" /><Typography variant="h6" sx={{ mt: 1 }}>Fast Service</Typography><Typography variant="body2" color="text.secondary">Lunch-ready in 15 minutes and dinner reservations managed smoothly.</Typography></CardContent></Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card><CardContent><DeliveryDiningIcon color="primary" /><Typography variant="h6" sx={{ mt: 1 }}>Delivery & Pickup</Typography><Typography variant="body2" color="text.secondary">Order by phone now and pick up fresh or choose local delivery.</Typography></CardContent></Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 9, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 2 }}>Tonight's Table Is Waiting</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Reserve for date night, family gatherings, or team dinners. We will have your table and oven ready.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button component={RouterLink} to="/contact" variant="contained" color="primary">Reserve a Table</Button>
            <Button component={RouterLink} to="/menu" variant="outlined" color="primary">See Full Menu</Button>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default HomePage;
