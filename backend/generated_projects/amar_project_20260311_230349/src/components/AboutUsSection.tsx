import React from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, Stack, useTheme } from '@mui/material';

interface AboutUsSectionProps {
  heading?: string;
  content?: string;
  image?: string;
}

const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  heading = 'Our Story: A Journey in Every Cup',
  content = 'Nestled in the heart of the city, "The Daily Grind" began with a simple dream: to craft the perfect coffee experience. Our founders, avid travelers and coffee enthusiasts, brought back unique beans and brewing techniques from around the globe. Every cup tells a story of passion, ethical sourcing, and meticulous craftsmanship. We believe coffee is more than just a drink; it is a moment of connection, a pause in the day, and a source of inspiration. Join us and discover your next favorite brew, made with love and dedication.',
  image = 'https://images.unsplash.com/photo-1511920170033-f8396922c6d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}) => {
  const theme = useTheme();

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Card
        elevation={8}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: theme.shape.borderRadius * 3,
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[10],
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[15],
          },
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt="A cozy coffee shop interior with barista preparing coffee"
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: 280, sm: 350, md: 'auto' },
            objectFit: 'cover',
            borderTopLeftRadius: { xs: theme.shape.borderRadius * 3, md: theme.shape.borderRadius * 3 },
            borderTopRightRadius: { xs: theme.shape.borderRadius * 3, md: 0 },
            borderBottomLeftRadius: { xs: 0, md: theme.shape.borderRadius * 3 },
            borderBottomRightRadius: { xs: 0, md: 0 },
          }}
        />
        <CardContent
          sx={{
            flex: 1,
            p: { xs: 3, sm: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: theme.spacing(3),
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.dark,
              textAlign: { xs: 'center', md: 'left' },
              width: '100%',
            }}
          >
            {heading}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{
              lineHeight: 1.7,
              color: theme.palette.text.secondary,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {content}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AboutUsSection;