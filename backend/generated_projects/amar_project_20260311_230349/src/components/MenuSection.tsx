import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Divider,
  Container,
  Grid,
  useTheme,
} from '@mui/material';

// 1. TypeScript Interfaces
interface MenuItem {
  name: string;
  description: string;
  price: string;
}

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

interface MenuSectionProps {
  menuCategories?: MenuCategory[];
}

// 2. Default Data for demonstration and fallback
const defaultMenuCategories: MenuCategory[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Start your culinary journey with our delightful small plates, perfect for sharing.',
    items: [
      { name: 'Crispy Calamari', description: 'Lightly fried calamari served with a zesty lemon aioli.', price: '$14.00' },
      { name: 'Bruschetta al Pomodoro', description: 'Toasted artisan bread topped with fresh tomatoes, basil, garlic, and olive oil.', price: '$11.00' },
      { name: 'Artisan Cheese Board', description: 'A curated selection of local and imported cheeses, accompanied by seasonal fruits and nuts.', price: '$18.00' },
    ],
  },
  {
    id: 'main-courses',
    name: 'Main Courses',
    description: 'Savor our signature dishes, crafted with the freshest seasonal ingredients and culinary passion.',
    items: [
      { name: 'Pan-Seared Salmon', description: 'Atlantic salmon fillet, served with roasted asparagus and a delicate lemon-dill sauce.', price: '$26.00' },
      { name: 'Filet Mignon', description: 'An exquisite 8oz prime beef filet, accompanied by creamy mashed potatoes and seasonal grilled vegetables.', price: '$38.00' },
      { name: 'Wild Mushroom Risotto', description: 'Creamy Arborio rice cooked with assorted wild mushrooms, finished with Parmesan cheese and truffle oil.', price: '$22.00' },
      { name: 'Chicken Parmesan', description: 'Crispy breaded chicken breast, smothered in melted mozzarella and marinara sauce, served with spaghetti.', price: '$24.00' },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Indulge in a sweet ending to your meal with our handcrafted desserts.',
    items: [
      { name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert with layers of mascarpone cheese and espresso-soaked ladyfingers.', price: '$9.00' },
      { name: 'Chocolate Lava Cake', description: 'Warm, rich chocolate cake with a molten center, served with a scoop of vanilla bean ice cream.', price: '$10.00' },
      { name: 'Seasonal Fruit Tart', description: 'A delicate pastry crust filled with vanilla cream and topped with fresh seasonal berries.', price: '$12.00' },
    ],
  },
];

// 3. Component Definition
const MenuSection: React.FC<MenuSectionProps> = ({ menuCategories }) => {
  const theme = useTheme();

  // Use provided categories or default ones if none are provided or empty
  const categoriesToRender = menuCategories && menuCategories.length > 0 ? menuCategories : defaultMenuCategories;

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 6, md: 10 }, // Responsive vertical padding
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius * 3, // Overall rounded container
        boxShadow: theme.shadows[1],
      }}
    >
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h2"
          component="h1"
          textAlign="center"
          color={theme.palette.text.primary}
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            letterSpacing: '-0.02em',
            mb: 2,
          }}
        >
          Our Culinary Delights
        </Typography>
        <Typography
          variant="h5"
          component="p"
          textAlign="center"
          color={theme.palette.text.secondary}
          sx={{
            maxWidth: 700,
            mx: 'auto',
            fontSize: { xs: '1.1rem', md: '1.3rem' },
          }}
        >
          Explore our thoughtfully curated menu, featuring fresh, seasonal ingredients and exquisite flavors.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {categoriesToRender.map((category) => (
          <Grid item xs={12} md={6} lg={4} key={category.id}>
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, md: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius * 2, // Slightly more rounded corners for cards
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                color={theme.palette.primary.main}
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '1.8rem', md: '2rem' },
                }}
              >
                {category.name}
              </Typography>
              {category.description && (
                <Typography
                  variant="body1"
                  color={theme.palette.text.secondary}
                  sx={{ mb: 2, fontStyle: 'italic' }}
                >
                  {category.description}
                </Typography>
              )}
              <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                {category.items.map((item, itemIndex) => (
                  <Box key={item.name} sx={{ pb: itemIndex < category.items.length - 1 ? 1 : 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.5 }}>
                      <Typography
                        variant="subtitle1"
                        component="h3"
                        color={theme.palette.text.primary}
                        sx={{ fontWeight: 600, flexShrink: 1, mr: 1 }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.primary.dark} // Use a darker shade for price for emphasis
                        sx={{ fontWeight: 700, flexShrink: 0 }}
                      >
                        {item.price}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color={theme.palette.text.secondary}>
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MenuSection;