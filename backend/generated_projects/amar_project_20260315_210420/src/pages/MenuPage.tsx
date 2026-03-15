import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack } from '@mui/material';
import { ArrowForward, Star, Speed, Security } from '@mui/icons-material';
import Header from '../components/Header';
import MenuDisplaySection from '../components/MenuDisplaySection';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  isSpecial?: boolean;
}

const appetizers: Array<MenuItem> = [
  { id: 'app1', name: 'Crispy Calamari', description: 'Lightly fried calamari with spicy marinara sauce.', price: '$12.99' },
  { id: 'app2', name: 'Caprese Skewers', description: 'Fresh mozzarella, cherry tomatoes, and basil with balsamic glaze.', price: '$10.50' },
  { id: 'app3', name: 'Garlic Parmesan Fries', description: 'Golden fries tossed in garlic butter and parmesan cheese.', price: '$8.00', isSpecial: true },
];

const mainCourses: Array<MenuItem> = [
  { id: 'main1', name: 'Grilled Salmon', description: 'Pan-seared salmon with asparagus and lemon-dill sauce.', price: '$24.99' },
  { id: 'main2', name: 'Ribeye Steak', description: '12oz prime ribeye, mashed potatoes, and seasonal vegetables.', price: '$32.00', isSpecial: true },
  { id: 'main3', name: 'Vegetable Lasagna', description: 'Layers of pasta, ricotta, spinach, and roasted vegetables.', price: '$18.75' },
  { id: 'main4', name: 'Chicken Alfredo', description: 'Creamy fettuccine alfredo with grilled chicken breast.', price: '$20.50' },
];

const desserts: Array<MenuItem> = [
  { id: 'des1', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.', price: '$9.50' },
  { id: 'des2', name: 'New York Cheesecake', description: 'Classic cheesecake with a berry compote.', price: '$8.75' },
  { id: 'des3', name: 'Tiramisu', description: 'Coffee-soaked ladyfingers with mascarpone cheese and cocoa.', price: '$9.00' },
];

const drinks: Array<MenuItem> = [
  { id: 'drk1', name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice.', price: '$4.00' },
  { id: 'drk2', name: 'Sparkling Water', description: 'Premium sparkling mineral water.', price: '$3.50' },
  { id: 'drk3', name: 'Espresso', description: 'Rich, concentrated coffee shot.', price: '$3.00' },
  { id: 'drk4', name: 'House Red Wine', description: 'A delightful glass of our finest house red.', price: '$9.00' },
];

const MenuPage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)',
        color: 'white',
        py: 12,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h1" sx={{ mb: 3, fontWeight: 700 }}>
            Explore Our Exquisite Menu
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, maxWidth: '700px', mx: 'auto' }}>
            A culinary journey of fresh ingredients and unforgettable flavors, crafted just for you. Discover your next favorite dish.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              bgcolor: 'secondary.main',
              '&:hover': { bgcolor: 'secondary.dark' }
            }}
          >
            View Today's Specials
          </Button>
        </Container>
      </Box>

      {/* Menu Sections */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack spacing={8}>
          <MenuDisplaySection title="Appetizers" items={appetizers} />
          <MenuDisplaySection title="Main Courses" items={mainCourses} />
          <MenuDisplaySection title="Desserts" items={desserts} />
          <MenuDisplaySection title="Beverages" items={drinks} />
        </Stack>
      </Container>

      {/* Optional: Call to action for reservations or delivery */}
      <Box sx={{
        background: 'linear-gradient(45deg, #ff7e5f 0%, #feb47b 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center',
        mt: 8
      }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Ready to Indulge?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Book a table or order online for a delightful dining experience.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                bgcolor: 'white',
                color: '#ff7e5f',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Make a Reservation
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Order for Delivery
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default MenuPage;