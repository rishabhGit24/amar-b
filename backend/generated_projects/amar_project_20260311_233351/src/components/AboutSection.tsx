import {
  CardMedia,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

/**
 * Props for the AboutSection component.
 * All props are optional and have sensible default values.
 */
interface AboutSectionProps {
  /**
   * The main heading for the about section.
   * Defaults to "Our Story & Philosophy".
   */
  heading?: string;
  /**
   * The main content text for the about section.
   * Defaults to a descriptive paragraph about a coffee shop's values.
   */
  content?: string;
  /**
   * The URL of the image to display in the about section.
   * Defaults to a high-quality placeholder image of a coffee shop interior.
   */
  image?: string;
}

/**
 * A reusable component for displaying an "About Us" section,
 * typically for a coffee shop's story and philosophy.
 * It features a responsive layout with an image and descriptive text.
 *
 * @param {AboutSectionProps} props - The props for the component.
 * @returns {JSX.Element} The AboutSection component.
 */
const AboutSection: React.FC<AboutSectionProps> = ({
  heading,
  content,
  image,
}) => {
  const theme = useTheme();

  // Sensible default values for props
  const defaultHeading = "Our Story & Philosophy";
  const defaultContent =
    "At our heart, we believe that every cup tells a story – from the rich soil where the beans are cultivated to the skilled hands that roast and brew them. Our philosophy centers on crafting exceptional coffee experiences, fostering a warm community space, and upholding sustainable practices. We meticulously source premium, ethically traded beans, ensuring not only superior flavor but also a positive impact on growers and the environment. More than just a coffee shop, we are a gathering place where connections are forged, ideas are shared, and moments are savored, one perfect sip at a time.";
  const defaultImage =
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // A cozy coffee shop interior

  const currentHeading = heading ?? defaultHeading;
  const currentContent = content ?? defaultContent;
  const currentImage = image ?? defaultImage;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper
        elevation={8}
        sx={{
          borderRadius: theme.shape.borderRadius * 2,
          p: { xs: 4, md: 8 },
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[10],
        }}
      >
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={currentImage}
              alt="A cozy coffee shop interior"
              sx={{
                borderRadius: theme.shape.borderRadius * 1.5,
                height: { xs: 250, sm: 350, md: 450 },
                objectFit: "cover",
                boxShadow: theme.shadows[6],
              }}
            />
          </Grid>

          {/* Text Content Section */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography
                variant="h2"
                component="h2"
                color="primary.dark"
                sx={{
                  fontWeight: 700,
                  textAlign: { xs: "center", md: "left" },
                  fontSize: { xs: "2.25rem", md: "3rem" },
                  lineHeight: 1.2,
                }}
              >
                {currentHeading}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                color="text.secondary"
                sx={{
                  textAlign: { xs: "center", md: "left" },
                  lineHeight: 1.7,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                }}
              >
                {currentContent}
              </Typography>
              {/* Optional: Add a button here if needed, e.g., "Learn More" */}
              {/* <Box sx={{ mt: 3, textAlign: { xs: "center", md: "left" } }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  aria-label="Learn more about our story"
                >
                  Discover More
                </Button>
              </Box> */}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutSection;
