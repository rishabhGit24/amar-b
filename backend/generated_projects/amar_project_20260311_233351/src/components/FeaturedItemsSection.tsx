import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

/**
 * Interface for a single featured item.
 */
interface FeaturedItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
}

/**
 * Props for the FeaturedItemsSection component.
 */
interface FeaturedItemsSectionProps {
  items?: FeaturedItem[];
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * FeaturedItemsSection component displays a grid of popular or new menu items.
 * It is designed to be production-ready, visually polished, and accessible.
 */
const FeaturedItemsSection: React.FC<FeaturedItemsSectionProps> = ({
  items,
  title,
  subtitle,
  ctaText,
  ctaLink,
}) => {
  const theme = useTheme();

  // Default items for demonstration if none are provided
  const defaultItems: FeaturedItem[] = [
    {
      id: "1",
      name: "Gourmet Burger Deluxe",
      description:
        "Juicy patty, aged cheddar, crispy bacon, and our secret sauce.",
      price: 15.99,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346379-8ce8e1c961ad?auto=format&fit=crop&w=600&q=80",
      category: "Main Course",
    },
    {
      id: "2",
      name: "Spicy Vegan Tacos",
      description:
        "Three corn tortillas filled with seasoned plant-based protein and fresh salsa.",
      price: 12.5,
      imageUrl:
        "https://images.unsplash.com/photo-1551500337-5859158f9862?auto=format&fit=crop&w=600&q=80",
      category: "Vegan",
    },
    {
      id: "3",
      name: "Artisan Margherita Pizza",
      description:
        "Classic Neapolitan pizza with fresh mozzarella, basil, and San Marzano tomatoes.",
      price: 18.0,
      imageUrl:
        "https://images.unsplash.com/photo-1593560704721-db14817ef54a?auto=format&fit=crop&w=600&q=80",
      category: "Pizza",
    },
    {
      id: "4",
      name: "Decadent Chocolate Lava Cake",
      description:
        "Warm chocolate cake with a molten center, served with vanilla bean ice cream.",
      price: 9.75,
      imageUrl:
        "https://images.unsplash.com/photo-1564350101561-b47d20bc6170?auto=format&fit=crop&w=600&q=80",
      category: "Dessert",
    },
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;

  const sectionTitle = title || "Our Featured Delights";
  const sectionSubtitle =
    subtitle || "Discover our most popular and newly added menu items.";
  const sectionCtaText = ctaText || "View All Items";
  const sectionCtaLink = ctaLink || "#all-items";

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: theme.palette.grey[50],
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={2} alignItems="center" sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              color: theme.palette.primary.dark,
              fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
            }}
          >
            {sectionTitle}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              textAlign: "center",
              maxWidth: "700px",
              color: theme.palette.text.secondary,
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            {sectionSubtitle}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            href={sectionCtaLink}
            component="a"
            aria-label={sectionCtaText}
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: theme.shadows[4],
              "&:hover": {
                boxShadow: theme.shadows[6],
                transform: "translateY(-2px)",
              },
              transition:
                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            }}
          >
            {sectionCtaText}
          </Button>
        </Stack>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {displayItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: theme.shape.borderRadius * 2,
                  boxShadow: theme.shadows[3],
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.name}
                  sx={{
                    objectFit: "cover",
                    borderTopLeftRadius: theme.shape.borderRadius * 2,
                    borderTopRightRadius: theme.shape.borderRadius * 2,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.primary.main,
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, minHeight: "40px" }}
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="p"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.secondary.dark,
                      mb: 2,
                      fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    }}
                  >
                    ${item.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    p: { xs: 2, sm: 3 },
                    pt: 0,
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddShoppingCartIcon />}
                    aria-label={"Add " + item.name + " to cart"}
                    sx={{
                      borderRadius: theme.shape.borderRadius,
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    aria-label={"View details for " + item.name}
                    sx={{
                      borderRadius: theme.shape.borderRadius,
                      "&:hover": {
                        bgcolor: theme.palette.secondary.light,
                      },
                    }}
                  >
                    Details
                  </Button>
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
