import {
  ArrowForward,
  Email,
  LocationOn,
  Phone,
  Security,
  Speed,
  Star,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MenuSection from "../components/MenuSection";

// Define interfaces for menu data
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

interface MenuCategory {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    id: "appetizers",
    title: "Exquisite Appetizers",
    description:
      "Begin your culinary journey with our selection of handcrafted appetizers, designed to tantalize your taste buds and prepare you for the delightful experience ahead. Each dish is prepared with the freshest ingredients, ensuring a perfect start to your meal.",
    items: [
      {
        id: "app1",
        name: "Truffle Arancini",
        description:
          "Crispy risotto balls filled with mozzarella and black truffle, served with a rich marinara sauce.",
        price: "$14.00",
      },
      {
        id: "app2",
        name: "Caprese Skewers",
        description:
          "Fresh cherry tomatoes, mozzarella balls, and basil leaves drizzled with balsamic glaze.",
        price: "$12.00",
      },
      {
        id: "app3",
        name: "Spicy Calamari Fritti",
        description:
          "Lightly fried calamari rings tossed with cherry peppers and a lemon-garlic aioli.",
        price: "$16.00",
      },
      {
        id: "app4",
        name: "Artisan Cheese Board",
        description:
          "A curated selection of local and imported cheeses, served with fig jam, honey, and artisanal crackers.",
        price: "$22.00",
      },
    ],
  },
  {
    id: "main-courses",
    title: "Signature Main Courses",
    description:
      "Our main courses are the heart of our menu, featuring a diverse range of dishes from succulent grilled meats to delicate seafood and vibrant vegetarian options. Crafted by our expert chefs, each plate is a masterpiece of flavor and presentation, promising an unforgettable dining experience.",
    items: [
      {
        id: "main1",
        name: "Pan-Seared Scallops",
        description:
          "Jumbo sea scallops seared to perfection, served with saffron risotto and asparagus spears.",
        price: "$32.00",
      },
      {
        id: "main2",
        name: "Filet Mignon",
        description:
          "8oz prime beef filet, grilled to your preference, accompanied by roasted garlic mashed potatoes and seasonal vegetables.",
        price: "$45.00",
      },
      {
        id: "main3",
        name: "Wild Mushroom Ravioli",
        description:
          "Homemade ravioli filled with a medley of wild mushrooms, tossed in a creamy sage butter sauce.",
        price: "$26.00",
      },
      {
        id: "main4",
        name: "Mediterranean Grilled Lamb Chops",
        description:
          "Marinated lamb chops, grilled and served with a refreshing cucumber-yogurt sauce and couscous salad.",
        price: "$38.00",
      },
      {
        id: "main5",
        name: "Vegan Buddha Bowl",
        description:
          "A vibrant bowl with quinoa, roasted sweet potatoes, avocado, chickpeas, kale, and a tahini dressing.",
        price: "$24.00",
      },
    ],
  },
  {
    id: "desserts",
    title: "Decadent Desserts",
    description:
      "Conclude your meal with one of our heavenly desserts, prepared fresh daily by our pastry chef. From classic favorites to innovative creations, our sweet treats are the perfect ending to any dining occasion, leaving a lasting impression of pure indulgence.",
    items: [
      {
        id: "des1",
        name: "Classic Tiramisu",
        description:
          "Layers of coffee-soaked ladyfingers, mascarpone cheese, and cocoa powder.",
        price: "$10.00",
      },
      {
        id: "des2",
        name: "Molten Chocolate Lava Cake",
        description:
          "Warm chocolate cake with a gooey molten center, served with vanilla bean ice cream.",
        price: "$12.00",
      },
      {
        id: "des3",
        name: "Seasonal Fruit Tart",
        description:
          "A delicate pastry crust filled with vanilla cream and topped with fresh seasonal fruits.",
        price: "$11.00",
      },
    ],
  },
  {
    id: "beverages",
    title: "Refreshing Beverages",
    description:
      "Complement your meal with our extensive selection of beverages, including artisanal coffees, premium teas, freshly squeezed juices, and a curated list of fine wines and craft beers. Our baristas and sommeliers are ready to help you find the perfect pairing.",
    items: [
      {
        id: "bev1",
        name: "Espresso",
        description: "Rich, concentrated coffee shot.",
        price: "$4.00",
      },
      {
        id: "bev2",
        name: "Fresh Orange Juice",
        description: "Squeezed daily from ripe oranges.",
        price: "$6.00",
      },
      {
        id: "bev3",
        name: "Sparkling Water",
        description: "Premium sparkling mineral water.",
        price: "$5.00",
      },
      {
        id: "bev4",
        name: "House Red Wine (Glass)",
        description: "A robust and fruity Cabernet Sauvignon.",
        price: "$12.00",
      },
    ],
  },
];

const MenuPage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF6B6B 0%, #FFD166 100%)", // Warm, inviting gradient
          color: "white",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url(/images/food-pattern.png) repeat", // Placeholder for a subtle pattern
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Savor the Flavors: Our Exquisite Menu Awaits
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            Embark on a culinary journey with our meticulously crafted menu,
            where every dish tells a story of passion, quality, and tradition.
            From farm-fresh ingredients to innovative culinary techniques, we
            promise an unforgettable dining experience that delights all your
            senses. Discover a symphony of tastes, textures, and aromas designed
            to elevate your meal into a celebration. Our chefs pour their heart
            into creating dishes that are not just food, but an art form,
            ensuring that each bite is a moment to cherish. We invite you to
            explore the diverse offerings, from comforting classics to
            adventurous new creations, all prepared with the utmost care and
            dedication to gastronomic excellence.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              bgcolor: "secondary.main",
              color: "white",
              "&:hover": {
                bgcolor: "secondary.dark",
                transform: "scale(1.05)",
                transition: "transform 0.3s ease-in-out",
              },
              boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
              borderRadius: "50px",
            }}
          >
            View Today's Specials
          </Button>
        </Container>
      </Box>

      {/* Menu Sections */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={8}>
          {menuData.map((category) => (
            <MenuSection
              key={category.id}
              title={category.title}
              description={category.description}
              items={category.items}
            />
          ))}
        </Stack>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #e0f7fa 0%, #e8f5e9 100%)", // Light, fresh gradient
          py: { xs: 8, md: 12 },
          color: "text.primary",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              color: "primary.dark",
              fontSize: { xs: "2rem", sm: "2.8rem", md: "3.5rem" },
            }}
          >
            Why Our Menu Stands Out
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 3,
                  borderRadius: "16px",
                  boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0px 15px 40px rgba(0,0,0,0.15)",
                  },
                  bgcolor: "white",
                }}
              >
                <CardContent>
                  <Star sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 600, color: "primary.dark" }}
                  >
                    Exquisite Flavors & Freshness
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.7 }}
                  >
                    Our commitment to culinary excellence begins with sourcing
                    the finest, freshest ingredients from local farms and
                    trusted suppliers. Every dish on our menu is a testament to
                    our dedication to flavor, crafted with precision and passion
                    by our award-winning chefs. We believe that exceptional food
                    starts with exceptional ingredients, and we go to great
                    lengths to ensure that only the best make it to your plate.
                    From vibrant seasonal vegetables to premium cuts of meat and
                    sustainably sourced seafood, our kitchen transforms these
                    elements into unforgettable gastronomic experiences. We
                    constantly innovate, blending traditional techniques with
                    modern culinary artistry to create dishes that are both
                    comforting and exciting, ensuring a delightful surprise with
                    every visit.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 3,
                  borderRadius: "16px",
                  boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0px 15px 40px rgba(0,0,0,0.15)",
                  },
                  bgcolor: "white",
                }}
              >
                <CardContent>
                  <Speed
                    sx={{ fontSize: 60, color: "secondary.main", mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 600, color: "primary.dark" }}
                  >
                    Prompt & Attentive Service
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.7 }}
                  >
                    Beyond the plate, we pride ourselves on delivering an
                    unparalleled dining experience through our prompt and
                    attentive service. Our dedicated team is trained to
                    anticipate your needs, offering recommendations and ensuring
                    every aspect of your visit is seamless and enjoyable. From
                    the moment you step through our doors until your departure,
                    you will be treated with warmth, professionalism, and
                    genuine hospitality. We understand that dining out is not
                    just about the food, but the entire atmosphere and
                    interaction. Our staff works tirelessly to create a
                    welcoming environment where you can relax, celebrate, and
                    create lasting memories, making each meal a truly special
                    occasion.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 3,
                  borderRadius: "16px",
                  boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0px 15px 40px rgba(0,0,0,0.15)",
                  },
                  bgcolor: "white",
                }}
              >
                <CardContent>
                  <Security
                    sx={{ fontSize: 60, color: "success.main", mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 600, color: "primary.dark" }}
                  >
                    Unwavering Quality & Hygiene
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.7 }}
                  >
                    Your health and safety are our top priorities. We adhere to
                    the highest standards of quality control and hygiene in
                    every aspect of our operation, from ingredient handling to
                    food preparation and presentation. Our kitchen maintains
                    rigorous cleanliness protocols, and our staff are thoroughly
                    trained in food safety practices. We are committed to
                    providing you with not only delicious food but also peace of
                    mind, knowing that every dish is prepared in a safe and
                    pristine environment. This unwavering commitment to quality
                    and hygiene ensures that you can enjoy your meal with
                    complete confidence, focusing solely on the delightful
                    flavors and the company you share.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call-to-Action Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)", // Green, fresh gradient
          color: "white",
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.8rem", md: "3.5rem" },
              textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            Ready to Experience Culinary Perfection?
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 5,
              opacity: 0.9,
              maxWidth: "700px",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            Don't just read about it, taste the difference! Make a reservation
            today to secure your table and embark on an unforgettable dining
            adventure. Whether it's a romantic dinner, a family celebration, or
            a casual meal with friends, our restaurant provides the perfect
            ambiance and exquisite food for every occasion. We look forward to
            welcoming you and creating a memorable experience tailored to your
            preferences.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 5,
                py: 1.8,
                fontSize: "1.2rem",
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "grey.200",
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
                boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                borderRadius: "50px",
              }}
            >
              Book a Table Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.8,
                fontSize: "1.2rem",
                borderColor: "white",
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease-in-out",
                },
                boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
                borderRadius: "50px",
              }}
            >
              Explore Catering Options
            </Button>
          </Stack>

          <Box sx={{ mt: 4, maxWidth: "400px", mx: "auto" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Stack spacing={1} alignItems="center">
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Phone /> +1 (555) 123-4567
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Email /> info@ourrestaurant.com
              </Typography>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <LocationOn /> 123 Gourmet Lane, Foodie City, FC 98765
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default MenuPage;
