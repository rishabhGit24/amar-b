import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Stack,
  useTheme,
} from '@mui/material';

interface AboutSectionProps {
  heading?: string;
  content?: string;
  image?: string;
}

const defaultHeading = "Our Story: Crafting Moments, One Cup at a Time";
const defaultContent = `At "The Daily Grind", our journey began with a simple yet profound passion: to create more than just coffee – to craft experiences. We believe every cup tells a story, a narrative of dedication from bean to brew. Sourcing only the finest, ethically grown beans from around the globe, we meticulously roast them to perfection, unlocking their unique flavors and aromas. Our commitment extends beyond the cup; it's about fostering community, sustainability, and a moment of pure indulgence in your day. Join us, and discover the difference that passion, quality, and a genuine love for coffee can make.`;
const defaultImage = "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // A high-quality coffee image

const AboutSection: React.FC<AboutSectionProps> = ({
  heading = defaultHeading,
  content = defaultContent,
  image = defaultImage,
}) => {
  const theme = useTheme();

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: theme.palette.grey[50],
        borderRadius: theme.shape.borderRadius,
        my: { xs: 4, md: 6 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 4, md: 8 },
          borderRadius: theme.shape.borderRadius * 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: `0px 10px 30px rgba(0, 0, 0, 0.08)`,
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 8 }}
          alignItems="center"
          direction={{ xs: 'column-reverse', md: 'row' }}
        >
          {/* Text Content */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.brown[800],
                  lineHeight: 1.2,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {heading}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.grey[700],
                  lineHeight: 1.7,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {content}
              </Typography>
              <Box sx={{ pt: 2, textAlign: { xs: 'center', md: 'left' } }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  aria-label="Discover more about our coffee shop"
                  sx={{
                    bgcolor: theme.palette.amber[700],
                    '&:hover': {
                      bgcolor: theme.palette.amber[800],
                    },
                    borderRadius: theme.shape.borderRadius * 1.5,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Discover Our Full Story
                </Button>
              </Box>
            </Stack>
          </Grid>

          {/* Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: { xs: 300, sm: 400, md: 500 },
                borderRadius: theme.shape.borderRadius * 2,
                overflow: 'hidden',
                boxShadow: `0px 8px 20px rgba(0, 0, 0, 0.1)`,
              }}
            >
              <img
                src={image}
                alt="A barista pouring coffee, symbolizing quality and craftsmanship"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutSection;