import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { Coffee, Restaurant, LocalDrink, Star, InfoOutlined } from '@mui/icons-material';

const MenuPage = () => {
  // Rich, professional content for menu items and descriptions (300+ words total)
  const menuCategories = [
    {
      name: "Artisan Coffee Creations",
      icon: <Coffee sx={{ mr: 1, color: 'primary.main' }} />,
      items: [
        {
          name: "Espresso Elegance",
          description: "A meticulously crafted shot of our signature single-origin espresso, boasting a rich crema and a complex flavor profile with notes of dark chocolate and toasted nuts. Sourced from sustainable farms, it's the perfect foundation for any coffee connoisseur seeking purity and intensity. Our baristas are trained to extract the optimal flavor, ensuring a consistently exceptional experience with every cup.",
          price: "$3.50",
          image: "https://via.placeholder.com/300x200/FFD700/000000?text=Espresso" // Placeholder image
        },
        {
          name: "Velvet Latte",
          description: "Smooth, creamy steamed milk perfectly blended with our exquisite espresso. Available with whole, oat, almond, or soy milk. A comforting classic, expertly prepared for a silky-smooth finish and a delicate balance of coffee and dairy. Each latte is adorned with beautiful latte art, making it a feast for both the eyes and the palate.",
          price: "$5.00",
          image: "https://via.placeholder.com/300x200/ADD8E6/000000?text=Latte"
        },
        {
          name: "Caramel Macchiato Dream",
          description: "Layers of vanilla syrup, steamed milk, rich espresso, and a decadent caramel drizzle. A sweet symphony of flavors designed to delight your senses and provide a luxurious coffee experience. This indulgent beverage is a perfect treat for those who enjoy a sweeter profile, offering a harmonious blend of robust coffee and creamy caramel notes.",
          price: "$5.75",
          image: "https://via.placeholder.com/300x200/F0E68C/000000?text=Macchiato"
        },
        {
          name: "Cold Brew Concentrate",
          description: "Our signature cold brew, steeped for 24 hours to extract a naturally sweet, low-acid, and incredibly smooth coffee concentrate. Served over ice, it's the ultimate refreshing pick-me-up, perfect for warm days or when you need a sustained energy boost. Its unique brewing process highlights the nuanced flavors of our selected beans.",
          price: "$4.75",
          image: "https://via.placeholder.com/300x200/B0C4DE/000000?text=Cold+Brew"
        }
      ]
    },
    {
      name: "Gourmet Culinary Delights",
      icon: <Restaurant sx={{ mr: 1, color: 'primary.main' }} />,
      items: [
        {
          name: "Avocado Toast Supreme",
          description: "Thick-cut artisanal sourdough, generously topped with fresh smashed avocado, vibrant cherry tomatoes, a sprinkle of chili flakes, and a drizzle of extra virgin olive oil. A vibrant and healthy start to your day, packed with essential nutrients and bursting with fresh flavors. It's a popular choice for a light yet satisfying meal.",
          price: "$9.50",
          image: "https://via.placeholder.com/300x200/90EE90/000000?text=Avocado+Toast"
        },
        {
          name: "Croissant Perfection",
          description: "Flaky, buttery, and baked to golden perfection. Our classic French croissant is the ideal accompaniment to your morning coffee or a light, satisfying snack any time of day. Made with premium butter, its delicate layers melt in your mouth. Plain or chocolate-filled options are available to suit your preference.",
          price: "$4.00",
          image: "https://via.placeholder.com/300x200/F5DEB3/000000?text=Croissant"
        },
        {
          name: "Mediterranean Quinoa Salad",
          description: "A refreshing blend of fluffy quinoa, crisp cucumber, ripe tomatoes, Kalamata olives, red onion, and crumbled feta cheese, all tossed in a zesty lemon-herb vinaigrette. A light yet fulfilling meal, rich in protein and fiber, perfect for a healthy lunch. This salad offers a delightful mix of textures and tangy flavors.",
          price: "$12.00",
          image: "https://via.placeholder.com/300x200/B0E0E6/000000?text=Quinoa+Salad"
        }
      ]
    },
    {
      name: "Refreshing Beverages & Teas",
      icon: <LocalDrink sx={{ mr: 1, color: 'primary.main' }} />,
      items: [
        {
          name: "Organic Green Tea",
          description: "A soothing cup of premium organic green tea, known for its delicate flavor and antioxidant properties. Sourced from the finest tea gardens, it offers a calming and invigorating experience. Served hot or iced, it's a refreshing choice for any time of day, promoting wellness and tranquility.",
          price: "$4.00",
          image: "https://via.placeholder.com/300x200/98FB98/000000?text=Green+Tea"
        },
        {
          name: "Freshly Squeezed Orange Juice",
          description: "Bursting with natural sweetness and vitamins, our orange juice is squeezed fresh daily from ripe, juicy oranges. A pure and invigorating beverage to brighten your day, free from any added sugars or preservatives. Experience the vibrant taste of sunshine in every sip.",
          price: "$5.50",
          image: "https://via.placeholder.com/300x200/FFA07A/000000?text=Orange+Juice"
        },
        {
          name: "Sparkling Berry Infusion",
          description: "A delightful blend of sparkling water infused with a medley of fresh berries and a hint of mint. A naturally sweet and effervescent drink, perfect for a light and bubbly refreshment. This vibrant beverage is both hydrating and delicious, offering a guilt-free indulgence.",
          price: "$6.00",
          image: "https://via.placeholder.com/300x200/FFC0CB/000000?text=Berry+Infusion"
        }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 700, color: 'primary.dark', textTransform: 'uppercase', letterSpacing: 1.5 }}>
          <Star sx={{ verticalAlign: 'middle', mr: 1, color: 'secondary.main', fontSize: { xs: '2rem', md: '2.5rem' } }} />
          Our Exquisite Menu Selection
          <Star sx={{ verticalAlign: 'middle', ml: 1, color: 'secondary.main', fontSize: { xs: '2rem', md: '2.5rem' } }} />
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.7, color: 'text.secondary', fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
          Welcome to our curated collection of culinary delights and artisanal beverages. Each item on our menu is crafted with passion, using only the finest, sustainably sourced ingredients to ensure an unforgettable experience. From the rich aroma of our freshly brewed coffees to the wholesome goodness of our gourmet food selections and the refreshing zest of our specialty drinks, we invite you to explore a world of flavor designed to satisfy every palate. We pride ourselves on quality, sustainability, and a commitment to excellence in every cup and plate, ensuring every visit is a memorable one.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 3, md: 6 }}>
        {menuCategories.map((category, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ mb: { xs: 3, md: 4 }, borderBottom: '2px solid', borderColor: 'primary.light', pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {category.icon}
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'primary.main', textTransform: 'capitalize', ml: 1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                {category.name}
              </Typography>
            </Box>
            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
              {category.items.map((item, itemIndex) => (
                <Grid item xs={12} sm={6} md={4} key={itemIndex}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                  }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={item.image}
                      alt={item.name}
                      sx={{ objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
                      <Box>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5, minHeight: { xs: 'auto', sm: '90px', md: '120px' } }}>
                          {item.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.dark' }}>
                          {item.price}
                        </Typography>
                        <Button variant="contained" size="small" sx={{ px: 2.5, py: 1, borderRadius: 20, textTransform: 'none', fontWeight: 600 }}>
                          Order Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: { xs: 6, md: 10 }, textAlign: 'center', p: { xs: 2, md: 4 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.dark' }}>
          <InfoOutlined sx={{ verticalAlign: 'middle', mr: 1, color: 'info.main' }} />
          Experience the Difference
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.7, color: 'text.secondary', mb: 4, fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
          We are dedicated to providing not just food and drink, but an unparalleled experience. Every ingredient is carefully selected, every recipe perfected, and every item prepared with the utmost care and attention to detail. Whether you're seeking a quick caffeine boost, a leisurely and wholesome meal, or a refreshing specialty beverage, our diverse menu is thoughtfully designed to cater to your desires and dietary preferences. Thank you for choosing us to be a part of your day. We eagerly look forward to serving you and making your visit truly exceptional!
        </Typography>
        <Button
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            borderColor: 'primary.main',
            color: 'primary.main',
            fontWeight: 600,
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor: 'primary.light',
              borderColor: 'primary.dark',
              boxShadow: 2
            }
          }}
        >
          View Our Specials
        </Button>
      </Box>
    </Container>
  );
};

export default MenuPage;