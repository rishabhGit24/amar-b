import React from 'react';
import { Box, Button, Card, CardContent, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface MenuItem {
  name: string;
  description: string;
  price: string;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    title: 'Classic Pizzas',
    items: [
      { name: 'Margherita Classica', description: 'Tomato, mozzarella, basil, olive oil.', price: '$18' },
      { name: 'Marinara', description: 'San Marzano tomato, garlic confit, oregano.', price: '$16' },
      { name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, fontina, parmesan.', price: '$23' },
    ],
  },
  {
    title: 'Specialty Pizzas',
    items: [
      { name: 'Truffle Mushroom Bianca', description: 'Ricotta base, roasted mushrooms, truffle oil.', price: '$24' },
      { name: 'Diavola Piccante', description: 'Spicy salami, smoked mozzarella, chili flakes.', price: '$22' },
      { name: 'Prosciutto e Rucola', description: 'Prosciutto, arugula, shaved parm, lemon zest.', price: '$25' },
    ],
  },
  {
    title: 'Pasta',
    items: [
      { name: 'Tagliatelle Bolognese', description: 'Slow-cooked beef and tomato ragu.', price: '$21' },
      { name: 'Penne Arrabbiata', description: 'Garlic, chili, pomodoro sauce.', price: '$18' },
      { name: 'Cacio e Pepe', description: 'Pecorino romano, cracked black pepper.', price: '$19' },
    ],
  },
  {
    title: 'Salads',
    items: [
      { name: 'Insalata Mista', description: 'Seasonal greens, cucumber, tomato, house vinaigrette.', price: '$12' },
      { name: 'Caesar al Forno', description: 'Romaine, focaccia croutons, parm, anchovy dressing.', price: '$13' },
    ],
  },
  {
    title: 'Desserts',
    items: [
      { name: 'Tiramisu', description: 'Espresso-soaked layers with mascarpone cream.', price: '$10' },
      { name: 'Panna Cotta', description: 'Vanilla bean cream with berry compote.', price: '$9' },
    ],
  },
  {
    title: 'Drinks',
    items: [
      { name: 'Italian Soda', description: 'Blood orange, lemon, or pomegranate.', price: '$5' },
      { name: 'Espresso / Cappuccino', description: 'House-roasted blend, barista crafted.', price: '$4 / $6' },
    ],
  },
];

const MenuPage: React.FC = () => {
  return (
    <Box>
      <Header />
      <Box sx={{ background: 'linear-gradient(135deg, #5F3025 0%, #B23A48 65%, #D9961A 100%)', color: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ mb: 2 }}>Our Menu</Typography>
          <Typography variant="body1" sx={{ maxWidth: 760, opacity: 0.94 }}>
            Built around premium ingredients and traditional techniques, our menu balances Italian comfort with modern flavor.
            Every pizza is hand-stretched to order, every pasta sauce is cooked in-house, and every dessert is finished fresh daily.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {menuData.map((category) => (
            <Grid key={category.title} item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" color="primary.main" sx={{ mb: 2 }}>{category.title}</Typography>
                  <Stack spacing={1.8}>
                    {category.items.map((item) => (
                      <Box key={item.name}>
                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                          <Typography variant="subtitle1" color="secondary.dark" sx={{ fontWeight: 700 }}>{item.price}</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                        <Divider sx={{ mt: 1.2 }} />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 2 }}>Have Dietary Preferences?</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We offer vegetarian, gluten-friendly, and dairy-light options. Let us know while ordering and our team will guide you.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button href="tel:+17185557499" variant="contained" color="primary">Call to Order</Button>
            <Button component={RouterLink} to="/contact" variant="outlined" color="primary">Reserve a Table</Button>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default MenuPage;
