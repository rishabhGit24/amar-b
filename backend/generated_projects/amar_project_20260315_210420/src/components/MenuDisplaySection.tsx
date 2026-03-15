import CakeIcon from "@mui/icons-material/Cake";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  tags?: string[];
  isSpecial?: boolean;
}

interface MenuDisplaySectionProps {
  title?: string;
  items?: MenuItem[];
  children?: React.ReactNode;
}

interface MenuCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    id: "appetizers",
    name: "Appetizers",
    icon: FastfoodIcon,
    items: [
      {
        id: "spring-rolls",
        name: "Crispy Spring Rolls",
        description:
          "Golden fried rolls filled with fresh vegetables and glass noodles, served with sweet chili sauce.",
        price: "$8.99",
        image:
          "https://via.placeholder.com/300x200/FFD700/000000?text=Spring+Rolls",
        tags: ["Vegetarian", "Popular"],
      },
      {
        id: "calamari",
        name: "Zesty Calamari Rings",
        description:
          "Lightly breaded calamari, fried to perfection, served with a lemon-garlic aioli.",
        price: "$12.50",
        image:
          "https://via.placeholder.com/300x200/ADD8E6/000000?text=Calamari",
        tags: ["Seafood"],
      },
    ],
  },
  {
    id: "main-courses",
    name: "Main Courses",
    icon: LocalDiningIcon,
    items: [
      {
        id: "ribeye",
        name: "Prime Ribeye Steak",
        description:
          "10oz grilled ribeye, seasoned with herbs, served with roasted asparagus and garlic mashed potatoes.",
        price: "$32.00",
        image: "https://via.placeholder.com/300x200/B0C4DE/000000?text=Ribeye",
        tags: ["Chef's Special", "Gluten-Free"],
      },
      {
        id: "pasta-primavera",
        name: "Pasta Primavera",
        description:
          "Fresh seasonal vegetables tossed with al dente fettuccine in a light pesto cream sauce.",
        price: "$19.75",
        image: "https://via.placeholder.com/300x200/90EE90/000000?text=Pasta",
        tags: ["Vegetarian"],
      },
      {
        id: "salmon",
        name: "Pan-Seared Salmon",
        description:
          "Atlantic salmon fillet, pan-seared to perfection, served with quinoa and steamed broccoli.",
        price: "$26.50",
        image: "https://via.placeholder.com/300x200/87CEEB/000000?text=Salmon",
        tags: ["Healthy", "Seafood"],
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: CakeIcon,
    items: [
      {
        id: "chocolate-lava",
        name: "Molten Chocolate Lava Cake",
        description:
          "Warm chocolate cake with a gooey molten center, served with vanilla bean ice cream.",
        price: "$9.50",
        image:
          "https://via.placeholder.com/300x200/D2B48C/000000?text=Lava+Cake",
        tags: ["Sweet Indulgence"],
      },
      {
        id: "cheesecake",
        name: "New York Style Cheesecake",
        description:
          "Classic creamy cheesecake on a graham cracker crust, topped with fresh berries.",
        price: "$8.75",
        image:
          "https://via.placeholder.com/300x200/F5DEB3/000000?text=Cheesecake",
        tags: ["Classic"],
      },
    ],
  },
];

const MenuDisplaySection: React.FC<MenuDisplaySectionProps> = ({
  title = "Menu Section",
  items = [],
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sectionSx: SxProps<Theme> = {
    py: { xs: 4, md: 8 },
    backgroundColor: theme.palette.background.default,
  };

  const categoryTitleSx: SxProps<Theme> = {
    mb: 3,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${theme.palette.divider}`,
    pb: 1,
  };

  const menuItemCardSx: SxProps<Theme> = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows[6],
    },
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
  };

  const cardMediaSx: SxProps<Theme> = {
    height: 180,
    objectFit: "cover",
  };

  const cardContentSx: SxProps<Theme> = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2,
  };

  const priceSx: SxProps<Theme> = {
    fontWeight: "bold",
    color: theme.palette.secondary.main,
    mt: 1,
  };

  const buttonSx: SxProps<Theme> = {
    mt: 4,
    py: 1.5,
    px: 3,
    fontSize: "1.1rem",
    fontWeight: "bold",
    borderRadius: theme.shape.borderRadius,
  };

  return (
    <Box sx={sectionSx}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 6, md: 10 }}>
          <Box textAlign="center">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Our Culinary Delights
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: "auto",
                mb: 4,
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Explore a world of flavors crafted with passion and the freshest
              ingredients. From savory appetizers to decadent desserts, there's
              something for every palate.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<RestaurantMenuIcon />}
              sx={buttonSx}
              aria-label="View Full Menu"
            >
              View Full Menu
            </Button>
          </Box>

          {(items.length > 0
            ? [
                {
                  id: title.toLowerCase().replace(/\s+/g, "-"),
                  name: title,
                  icon: RestaurantMenuIcon,
                  items,
                },
              ]
            : menuCategories
          ).map((category) => (
            <Box key={category.id}>
              <Typography variant="h4" component="h2" sx={categoryTitleSx}>
                <category.icon fontSize="large" />
                {category.name}
              </Typography>
              <Divider sx={{ mb: 4, borderColor: theme.palette.divider }} />
              <Grid container spacing={{ xs: 2, md: 4 }}>
                {category.items.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card sx={menuItemCardSx}>
                      <CardMedia
                        component="img"
                        sx={cardMediaSx}
                        image={item.image}
                        alt={item.name}
                      />
                      <CardContent sx={cardContentSx}>
                        <Box>
                          <Typography
                            variant="h5"
                            component="h3"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ minHeight: isMobile ? "auto" : 60 }}
                          >
                            {item.description}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 1, flexWrap: "wrap" }}
                          >
                            {item.tags &&
                              item.tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                  sx={{ mb: 0.5 }}
                                />
                              ))}
                          </Stack>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                          }}
                        >
                          <Typography variant="h6" sx={priceSx}>
                            {item.price}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            aria-label={`Add ${item.name} to cart`}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
        {children}
      </Container>
    </Box>
  );
};

export default MenuDisplaySection;
