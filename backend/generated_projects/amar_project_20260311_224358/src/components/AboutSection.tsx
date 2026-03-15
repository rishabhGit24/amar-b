import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Favorite, People, Lightbulb, Storefront } from '@mui/icons-material';

/**
 * AboutSection Component
 *
 * A content block detailing the shop's story, values, and commitment to its customers,
 * built entirely with Material-UI components and adhering to strict styling guidelines.
 */
const AboutSection = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Main Title and Subtitle */}
      <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
        <Typography
          variant="h2"
          component="h1" // Semantically an H1, styled as H2
          sx={{
            fontWeight: 700,
            color: 'primary.dark',
            mb: 2,
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
            lineHeight: 1.2,
          }}
        >
          Our Story: Crafting Excellence, Building Community
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            maxWidth: '800px',
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.15rem' },
            lineHeight: 1.6,
          }}
        >
          Discover the passion, dedication, and values that define us. Every product tells a story, and ours is built on a foundation of quality, innovation, and genuine connection with our customers.
        </Typography>
      </Box>

      {/* Story Section - Two Columns */}
      <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
        {/* Left Column: Visual Placeholder */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: { xs: 280, sm: 350, md: 450 },
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 6,
              backgroundImage: 'url(https://source.unsplash.com/random/800x600?craftsmanship,workshop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
            }}
          >
            {/* Optional: Overlay icon or text if image fails to load, or for stylistic choice */}
            {/* <Storefront sx={{ fontSize: '5rem', color: 'rgba(255,255,255,0.7)' }} /> */}
          </Box>
        </Grid>

        {/* Right Column: Detailed Story Content */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2rem' },
            }}
          >
            Our Journey: From a Dream to a Thriving Hub
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              lineHeight: 1.8,
              color: 'text.primary',
              fontSize: { xs: '0.95rem', sm: '1rem' },
            }}
          >
            Founded in 2010 by a small team of passionate artisans, our shop began with a simple yet profound vision: to create exceptional products that not only meet but consistently exceed expectations. What started as a humble endeavor in a small workshop has blossomed into a vibrant community hub, cherished by customers who appreciate the meticulous craftsmanship and thoughtful design embedded in everything we offer. We believe that true quality is a continuous journey, not a static destination, and we are constantly refining our processes and sourcing the finest materials to ensure every item reflects our unwavering commitment to excellence.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              lineHeight: 1.8,
              color: 'text.primary',
              fontSize: { xs: '0.95rem', sm: '1rem' },
            }}
          >
            Our initial inspiration stemmed from a desire to bring back the artistry of handmade goods in an increasingly mass-produced world. We wanted to offer an alternative – products with soul, character, and a unique story. This dedication led us through countless hours of experimentation, learning, and perfecting our craft. Each challenge we faced only strengthened our resolve, pushing us to innovate and grow, always keeping our customers' satisfaction at the forefront of our minds. We are incredibly proud of the journey we've taken and the loyal community we've built along the way, a testament to shared values and a love for authentic creations.
          </Typography>
        </Grid>
      </Grid>

      {/* Core Values Section */}
      <Box sx={{ mt: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'primary.dark',
            mb: { xs: 4, md: 6 },
            fontSize: { xs: '2rem', sm: '2.5rem' },
          }}
        >
          Our Core Values: The Pillars of Our Philosophy
        </Typography>
        <Grid container spacing={{ xs: 3, md: 6 }} justifyContent="center">
          {/* Value Card 1: Passion & Craftsmanship */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 8, borderColor: 'primary.light' },
                backgroundColor: 'background.paper',
              }}
            >
              <Favorite sx={{ fontSize: '3.5rem', color: 'error.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                Passion & Craftsmanship
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.7 }}>
                Every piece we create is born from a deep, unwavering love for our craft. We meticulously handcraft each item with unparalleled attention to detail, ensuring superior quality and a unique character that mass-produced goods simply cannot replicate. Our dedication to artistry is evident in every stitch, every finish, and every carefully chosen material.
              </Typography>
            </Box>
          </Grid>

          {/* Value Card 2: Community & Connection */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 8, borderColor: 'primary.light' },
                backgroundColor: 'background.paper',
              }}
            >
              <People sx={{ fontSize: '3.5rem', color: 'info.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                Community & Connection
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.7 }}>
                We believe in fostering strong, meaningful relationships – not just with our customers, but also with our suppliers and the wider community. Our shop is more than a place of commerce; it's a gathering point where shared values and mutual respect thrive, creating a supportive ecosystem for everyone involved.
              </Typography>
            </Box>
          </Grid>

          {/* Value Card 3: Innovation & Sustainability */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 8, borderColor: 'primary.light' },
                backgroundColor: 'background.paper',
              }}
            >
              <Lightbulb sx={{ fontSize: '3.5rem', color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
                Innovation & Sustainability
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.7 }}>
                We are continuously seeking new ways to improve, innovate, and evolve our products and processes. Alongside this drive for progress, we are deeply committed to sustainable practices that respect our planet, minimize our environmental footprint, and ensure a brighter future for generations to come.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ mt: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            mb: 3,
            fontSize: { xs: '1.75rem', sm: '2rem' },
          }}
        >
          Our Commitment to You
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 5,
            lineHeight: 1.8,
            maxWidth: '900px',
            mx: 'auto',
            color: 'text.primary',
            fontSize: { xs: '0.95rem', sm: '1rem' },
          }}
        >
          At the heart of everything we do is a steadfast commitment to our customers. We strive to provide not just products, but experiences that delight and inspire. From the moment you discover us to the joy of receiving and using our creations, we aim for excellence at every touchpoint. Your satisfaction is our greatest reward, and we are dedicated to maintaining the highest standards of service and product integrity. We invite you to become a cherished part of our story, to explore our thoughtfully curated collections, and to experience the profound difference that passion and purpose can make in every item we offer.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: { xs: 4, sm: 6 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '1rem', sm: '1.15rem' },
            borderRadius: 8,
            boxShadow: 3,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          }}
        >
          Explore Our Collections
        </Button>
      </Box>
    </Container>
  );
};

export default AboutSection;