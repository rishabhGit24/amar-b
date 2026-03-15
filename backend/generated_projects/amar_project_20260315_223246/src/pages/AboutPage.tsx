import React from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  return (
    <Box>
      <Header />

      <Box sx={{ background: 'linear-gradient(130deg, #2E8B57 0%, #5F3025 55%, #B23A48 100%)', color: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ mb: 2 }}>Our Story</Typography>
          <Typography variant="body1" sx={{ maxWidth: 760, opacity: 0.94 }}>
            Bella Napoli started as a family dream: bring authentic Neapolitan-style cooking to Brooklyn with honest ingredients,
            warm service, and a room that feels like home. Three generations later, our recipes still begin with hand-crushed tomatoes,
            slow-fermented dough, and a lot of care in every plate.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>Ingredient Standards</Typography>
                <Typography variant="body2" color="text.secondary">
                  We source San Marzano tomatoes, cold-pressed olive oil, imported flour, and local seasonal produce.
                  Every shipment is quality-checked for consistency and freshness.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>Kitchen Craft</Typography>
                <Typography variant="body2" color="text.secondary">
                  Dough is rested for 48 hours for flavor and digestibility. Sauces are simmered in small batches.
                  Pizzas are baked fast at high heat for the signature leopard-spot crust.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>Dining Experience</Typography>
                <Typography variant="body2" color="text.secondary">
                  From weekday lunches to weekend celebrations, we keep service attentive, timing sharp, and the atmosphere warm and lively.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 2 }}>Meet the Team</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 820 }}>
            Chef Marco leads the kitchen with a focus on traditional techniques and modern balance. Front-of-house is led by Sofia,
            who ensures every guest receives thoughtful, friendly service from welcome to dessert.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={RouterLink} to="/menu" variant="contained" color="primary">Explore the Menu</Button>
            <Button component={RouterLink} to="/contact" variant="outlined" color="primary">Plan a Reservation</Button>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AboutPage;
