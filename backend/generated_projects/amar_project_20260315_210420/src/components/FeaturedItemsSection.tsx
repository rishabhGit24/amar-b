import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  Rating,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';

interface FeaturedItemsSectionProps {
  children?: React.ReactNode;
}

interface FeaturedItem {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  rating: number;
  reviews: number;
}

const featuredItems: FeaturedItem[] = [
  {
    id: '1',
    name: 'Spicy Chicken Burger',
    description: 'Juicy grilled chicken, jalapeños, and our secret spicy sauce.',
    price: '$12.99',
    imageUrl: 'https://images.unsplash.com/photo-1568901346379-8ce8e1e7c5b8?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviews: 245,
  },
  {
    id: '2',
    name: 'Vegan Delight Pizza',
    description: 'Fresh vegetables, vegan cheese, and a crispy gluten-free crust.',
    price: '$15.50',
    imageUrl: 'https://images.unsplash.com/photo-1593560704721-db141a347b59?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviews: 180,
  },
  {
    id: '3',
    name: 'Classic Beef Steak',
    description: 'Perfectly grilled sirloin steak with a side of roasted potatoes.',
    price: '$24.00',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviews: 310,
  },
  {
    id: '4',
    name: 'Fresh Berry Smoothie',
    description: 'A refreshing blend of mixed berries, yogurt, and a hint of honey.',
    price: '$7.25',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-af4e7d1a4f0a?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviews: 120,
  },
];

const FeaturedItemsSection: React.FC<FeaturedItemsSectionProps> = ({ children }) => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: 'background.paper',
        color: 'text.primary',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            mb: { xs: 4, md: 8 },
            fontWeight: 700,
            color: 'primary.main',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
          }}
        >
          Our Featured Delights
        </Typography>

        <Grid container spacing={{ xs: 3, md: 5 }} justifyContent="center">
          {featuredItems.map((item: FeaturedItem) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
                  },
                  backgroundColor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.name}
                  sx={{
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    objectFit: 'cover',
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      minHeight: '3rem',
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      flexGrow: 1,
                      minHeight: '4rem',
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ mb: 1 }}
                  >
                    <Rating
                      name={'rating-' + item.id}
                      value={item.rating}
                      precision={0.1}
                      readOnly
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({item.reviews} reviews)
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h5"
                    component="p"
                    sx={{
                      fontWeight: 700,
                      color: 'secondary.main',
                      mb: 2,
                    }}
                  >
                    {item.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    sx={{
                      mt: 'auto',
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    aria-label={'Add ' + item.name + ' to cart'}
                  >
                    Add to Cart
                  </Button>
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

export default FeaturedItemsSection;