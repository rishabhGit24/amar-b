import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Stack } from '@mui/material';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface WhyChooseUsSectionProps {
  children?: React.ReactNode;
}

const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ children }) => {
  const benefits = [
    {
      icon: <LocalDiningIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Fresh, Local Ingredients',
      description: 'We source the finest, freshest ingredients daily from local farms to ensure every bite is bursting with flavor and quality.',
    },
    {
      icon: <RestaurantMenuIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Authentic Italian Recipes',
      description: 'Our pizzas are crafted following time-honored Italian traditions, passed down through generations, for a truly authentic taste experience.',
    },
    {
      icon: <DeliveryDiningIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Lightning-Fast Delivery',
      description: 'Craving pizza now? Our dedicated delivery team ensures your hot, delicious meal arrives at your door quickly and efficiently.',
    },
    {
      icon: <SentimentSatisfiedAltIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Exceptional Customer Service',
      description: 'Your satisfaction is our priority. Our friendly staff is always ready to assist you, making your experience delightful from order to delivery.',
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Great Value, Unbeatable Taste',
      description: 'Enjoy premium quality pizzas and dishes at prices that won\'t break the bank. Delicious food doesn\'t have to be expensive.',
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            mb: { xs: 2, md: 3 },
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          Why Choose AMAR Pizzeria?
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            mb: { xs: 5, md: 8 },
            color: 'text.secondary',
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          Discover the difference that passion, quality, and tradition make in every slice. We are committed to delivering an unparalleled dining experience.
        </Typography>

        <Grid container spacing={{ xs: 3, md: 5 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: { xs: 3, md: 4 },
                  boxShadow: 3,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
                  <Box sx={{ mb: 2 }}>
                    {benefit.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      mb: 1.5,
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {children}
      </Container>
    </Box>
  );
};

export default WhyChooseUsSection;