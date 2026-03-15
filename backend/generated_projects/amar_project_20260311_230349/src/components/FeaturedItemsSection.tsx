import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InfoIcon from '@mui/icons-material/Info';

interface FeaturedItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  altText: string;
}

interface FeaturedItemsSectionProps {
  items?: FeaturedItem[];
}

const defaultItems: FeaturedItem[] = [
  {
    id: 'item1',
    name: 'Signature Burger',
    description: 'Juicy patty, fresh veggies, special sauce. A classic reinvented.',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-16782b66d7e0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: 'A delicious signature burger with fries',
  },
  {
    id: 'item2',
    name: 'Garden Fresh Salad',
    description: 'Crisp greens, seasonal vegetables, light vinaigrette. Healthy and flavorful.',
    price: 9.50,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a573fd9cdf80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: 'A vibrant garden fresh salad',
  },
  {
    id: 'item3',
    name: 'Artisan Pizza',
    description: 'Hand-tossed dough, premium toppings, baked to perfection. A true delight.',
    price: 18.75,
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46bc0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: 'A freshly baked artisan pizza',
  },
  {
    id: 'item4',
    name: 'Decadent Chocolate Cake',
    description: 'Rich, moist chocolate cake with a velvety ganache. The perfect sweet ending.',
    price: 7.25,
    imageUrl: 'https://images.unsplash.com/photo-1562777717-dc698822a1d2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: 'A slice of decadent chocolate cake',
  },
];

const FeaturedItemsSection: React.FC<FeaturedItemsSectionProps> = ({ items = defaultItems }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        py: { xs: 6, md: 10 },
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.primary.main,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
            }}
          >
            Discover Our Favorites
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 700,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
            }}
          >
            Hand-picked selections just for you. Experience the best of our culinary creations.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 5 }}>
          {items.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: theme.shape.borderRadius * 2,
                  boxShadow: theme.shadows[6],
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[12],
                  },
                  backgroundColor: theme.palette.background.paper,
                  border: '1px solid ' + alpha(theme.palette.divider, 0.1),
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.altText}
                  sx={{
                    objectFit: 'cover',
                    borderTopLeftRadius: theme.shape.borderRadius * 2,
                    borderTopRightRadius: theme.shape.borderRadius * 2,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    component="h3"
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.primary.dark,
                      fontSize: { xs: '1.25rem', sm: '1.35rem', md: '1.5rem' },
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, minHeight: 40 }}
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.secondary.main,
                      fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                    }}
                  >
                    ${item.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    sx={{
                      borderRadius: theme.shape.borderRadius * 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton
                    aria-label={'Learn more about ' + item.name}
                    color="info"
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                      },
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedItemsSection;