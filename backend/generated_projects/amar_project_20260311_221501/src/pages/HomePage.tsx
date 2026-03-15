```typescript
import React from 'react';
import { Box, Container, Typography, Button, Card, Grid } from '@mui/material';
import { LocalCafe, Star, CoffeeMaker, BakeryDining } from '@mui/icons-material';

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero Section: Awaken Your Senses */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 6, md: 12 },
          px: { xs: 2, md: 4 },
          mb: { xs: 6, md: 10 },
          backgroundColor: 'primary.light', // Using theme color for background
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LocalCafe sx={{ fontSize: { xs: 60, md: 80 }, color: 'primary.dark', mb: 2 }} />
        <Typography
          variant="h2"
          component="h1" // Semantic HTML for screen readers
          sx={{
            mb: { xs: 2, md: 3 },
            fontWeight: 700,
            color: 'primary.dark',
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            lineHeight: 1.1,
          }}
        >
          Awaken Your Senses at The Daily Grind Coffee Co.
        </Typography>
        <Typography
          variant="h6"
          component="p" // Semantic HTML
          sx={{
            mb: { xs: 3, md: 5 },
            lineHeight: 1.7,
            maxWidth: 800,
            color: 'text.secondary',
            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
          }}
        >
          Step into a world where every bean tells a story, and every cup is a masterpiece. The Daily Grind Coffee Co. is more than just a coffee shop; it's a sanctuary for connoisseurs and casual sippers alike. We meticulously source the finest Arabica beans from sustainable farms around the globe, ensuring a rich, aromatic experience with every brew. Our expert baristas craft each drink with passion and precision, from the velvety smoothness of a classic latte to the bold intensity of a single-origin espresso. Discover your new favorite escape, where quality meets comfort in every delightful sip.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            px: { xs: 4, md: 6 },
            py: { xs: 1.5, md: 2 },
            fontSize: { xs: '1rem', md: '1.15rem' },
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 5,
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        >
          View Our Full Menu
        </Button>
      </Box>

      {/* Our Philosophy Section: Crafting Moments */}
      <Box sx={{ py: { xs: 4, md: 8 }, mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            mb: { xs: 2, md: 4 },
            fontWeight: 600,
            color: 'primary.main',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          Crafting Moments, One Cup at a Time
        </Typography>
        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: 'text.primary',
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                  textAlign: 'left',
                }}
              >
                At The Daily Grind, we believe coffee is an art form and a catalyst for connection. Our philosophy centers on quality, community, and sustainability. We partner directly with growers who share our commitment to ethical practices and environmental stewardship, bringing you exceptional flavors while supporting responsible agriculture. Beyond the bean, we foster a warm, inviting atmosphere where conversations flow as freely as our coffee. Whether you're catching up with friends, diving into a good book, or simply enjoying a moment of solitude, our doors are always open to provide that perfect backdrop. Experience the difference that dedication makes in every aspect of your visit.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Placeholder for an image, represented by a Box with a background color and icon */}
            <Box
              sx={{
                width: '100%',
                height: { xs: 200, sm: 300, md: 400 },
                backgroundColor: 'grey.300',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'grey.600',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                boxShadow: 1,
              }}
            >
              <CoffeeMaker sx={{ fontSize: 80, color: 'grey.600' }} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Our Offerings Section: Signature Delights */}
      <Box sx={{ py: { xs: 4, md: 8 }, mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            mb: { xs: 4, md: 6 },
            fontWeight: 600,
            color: 'primary.main',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
        >
          Our Signature Offerings
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Card 1: Espresso Classics */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <LocalCafe sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
              <Typography
                variant="h5"
                component="h3"
                sx={{ mb: 1.5, fontWeight: 600, color: 'primary.dark' }}
              >
                Espresso Classics
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                Indulge in the timeless elegance of our espresso-based beverages. From the robust shot of pure espresso to the creamy comfort of a cappuccino or macchiato, each is prepared with meticulous care. Our signature blend offers a harmonious balance of sweetness and strength, designed to invigorate your morning or provide a delightful afternoon pick-me-up. Explore the rich crema and complex notes that define true artisanal coffee, crafted by our skilled baristas.
              </Typography>
            </Card>
          </Grid>

          {/* Card 2: Artisan Brews */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CoffeeMaker sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
              <Typography
                variant="h5"
                component="h3"
                sx={{ mb: 1.5, fontWeight: 600, color: 'primary.dark' }}
              >
                Artisan Brews
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                Discover the nuanced world of pour-overs, cold brews, and French presses. We highlight single-origin beans with distinct flavor profiles, allowing you to embark on a global coffee journey without leaving your seat. Our cold brew, steeped for over 18 hours, offers a remarkably smooth, low-acid experience, perfect for a refreshing lift. Ask our baristas about today's featured brew and uncover new favorites that will tantalize your palate.
              </Typography>
            </Card>
          </Grid>

          {/* Card 3: Gourmet Pastries */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <BakeryDining sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }} />
              <Typography
                variant="h5"
                component="h3"
                sx={{ mb: 1.5, fontWeight: 600, color: 'primary.dark' }}
              >
                Gourmet Pastries
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                Complement your coffee with our delectable selection of freshly baked pastries. Sourced daily from local artisan bakers, our offerings range from flaky croissants and buttery scones to decadent muffins and gluten-free treats. Each pastry is crafted with premium ingredients, providing the perfect sweet or savory accompaniment to your beverage. Treat yourself to a moment of pure bliss with our delightful selection.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action / Visit Us Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 4 },
          backgroundColor: 'secondary.light', // Another theme color
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Star sx={{ fontSize: { xs: 50, md: 70 }, color: 'secondary.dark', mb: 2 }} />
        <Typography
          variant="h3"
          component="h2"
          sx={{
            mb: { xs: 2, md: 3 },
            fontWeight: 700,
            color: 'secondary.dark',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
          }}
        >
          Your Daily Dose of Delight Awaits
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: {