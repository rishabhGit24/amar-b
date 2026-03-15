import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  Divider,
  Container,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';

// --- Type Definitions ---
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string; // Optional image URL for visual appeal
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuSectionProps {
  menuItems?: MenuCategory[];
}

// --- Default Data ---
const defaultMenuItems: MenuCategory[] = [
  {
    id: 'coffee-espresso',
    name: 'Coffee & Espresso',
    items: [
      {
        id: 'espresso',
        name: 'Espresso',
        description: 'A concentrated shot of rich, aromatic coffee, the heart of many beverages.',
        price: 3.00,
      },
      {
        id: 'latte',
        name: 'Latte',
        description: 'Smooth espresso with steamed milk and a delicate layer of microfoam.',
        price: 4.50,
      },
      {
        id: 'cappuccino',
        name: 'Cappuccino',
        description: 'Equal parts espresso, steamed milk, and airy foam for a classic experience.',
        price: 4.25,
      },
      {
        id: 'americano',
        name: 'Americano',
        description: 'Espresso shots lengthened with hot water, creating a similar strength to drip coffee.',
        price: 3.75,
      },
      {
        id: 'cold-brew',
        name: 'Cold Brew',
        description: 'Slow-steeped in cool water for 20 hours, resulting in a super-smooth, low-acid concentrate.',
        price: 4.75,
      },
    ],
  },
  {
    id: 'pastries-baked-goods',
    name: 'Pastries & Baked Goods',
    items: [
      {
        id: 'croissant',
        name: 'Butter Croissant',
        description: 'Flaky, golden-brown pastry with a rich, buttery aroma, perfect for any time.',
        price: 3.50,
      },
      {
        id: 'blueberry-muffin',
        name: 'Blueberry Muffin',
        description: 'A moist, tender muffin generously studded with sweet, juicy blueberries.',
        price: 3.25,
      },
      {
        id: 'chocolate-chip-cookie',
        name: 'Chocolate Chip Cookie',
        description: 'Warm, gooey, and loaded with premium chocolate chips, a timeless favorite.',
        price: 2.75,
      },
      {
        id: 'almond-croissant',
        name: 'Almond Croissant',
        description: 'A buttery croissant filled with sweet almond frangipane and topped with toasted almonds.',
        price: 4.00,
      },
    ],
  },
  {
    id: 'savory-bites',
    name: 'Savory Bites',
    items: [
      {
        id: 'avocado-toast',
        name: 'Avocado Toast',
        description: 'Toasted sourdough, smashed avocado, a sprinkle of chili flakes, and sea salt.',
        price: 7.00,
      },
      {
        id: 'breakfast-burrito',
        name: 'Breakfast Burrito',
        description: 'Scrambled eggs, melted cheese, seasoned potatoes, and a hint of salsa in a warm tortilla.',
        price: 6.50,
      },
      {
        id: 'quiche-lorraine',
        name: 'Quiche Lorraine',
        description: 'Classic French quiche with crispy bacon, rich Gruyère cheese, and a creamy custard filling.',
        price: 5.75,
      },
    ],
  },
];

// --- MenuSection Component ---
const MenuSection: React.FC<MenuSectionProps> = ({ menuItems = defaultMenuItems }) => {
  const theme = useTheme();

  // Define a warm, inviting color palette with dark mode considerations
  const primaryColor = theme.palette.mode === 'dark' ? theme.palette.orange[200] : theme.palette.brown[700];
  const backgroundColor = theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50];
  const textColor = theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800];
  const lightTextColor = theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600];
  const dividerColor = theme.palette.mode === 'dark' ? alpha(theme.palette.grey[600], 0.5) : alpha(theme.palette.grey[400], 0.5);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 8 }, // Responsive vertical padding
        backgroundColor: backgroundColor,
        color: textColor,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Stack spacing={{ xs: 6, md: 10 }}>
        {/* Main Section Title */}
        <Typography
          variant="h2"
          component="h1"
          align="center"
          sx={{
            fontWeight: 700,
            color: primaryColor,
            mb: theme.spacing(2),
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Our Menu
        </Typography>

        {menuItems.map((category) => (
          <Box key={category.id} sx={{ mb: theme.spacing(6) }}>
            {/* Category Title */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: theme.spacing(4) }}
            >
              <Divider sx={{ flexGrow: 1, borderColor: dividerColor }} />
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: primaryColor,
                  textAlign: 'center',
                  px: theme.spacing(2),
                  textTransform: 'capitalize',
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                }}
              >
                {category.name}
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: dividerColor }} />
            </Stack>

            {/* Menu Items Grid */}
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {category.items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: theme.spacing(3),
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: theme.palette.background.paper, // Use default paper background
                      borderRadius: theme.shape.borderRadius,
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[6],
                      },
                      '&:focus-within': { // Accessibility: Highlight card when an interactive element inside is focused
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[6],
                        outline: `2px solid ${primaryColor}`,
                        outlineOffset: '2px',
                      },
                    }}
                  >
                    <Stack spacing={1.5}>
                      {item.image && (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: '100%',
                            height: 180,
                            objectFit: 'cover',
                            borderRadius: theme.shape.borderRadius,
                            mb: theme.spacing(1.5),
                          }}
                        />
                      )}
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          color: textColor,
                          lineHeight: 1.2,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: lightTextColor,
                          minHeight: theme.spacing(6), // Ensure consistent height for description
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: theme.spacing(2) }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: primaryColor,
                          fontSize: '1.4rem',
                        }}
                      >
                        ${item.price.toFixed(2)}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        aria-label={`Order ${item.name}`}
                        sx={{
                          backgroundColor: primaryColor,
                          '&:hover': {
                            backgroundColor: alpha(primaryColor, 0.8),
                          },
                          color: theme.palette.getContrastText(primaryColor), // Ensure good contrast
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                        onClick={() => alert(`Added "${item.name}" to cart!`)} // Example interaction
                      >
                        Order Now
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default MenuSection;