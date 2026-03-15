import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Rating,
  useTheme,
} from '@mui/material';

// Define the interface for a single testimonial
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  avatarUrl?: string;
  rating?: number; // 1-5 stars
}

// Define the props for the TestimonialsSection component
interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

// Default testimonials data for when no props are provided
const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'The service exceeded all my expectations. The team was incredibly responsive and delivered outstanding results ahead of schedule. Highly recommend!',
    author: 'Sarah Chen',
    title: 'CEO, Innovate Solutions',
    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
    rating: 5,
  },
  {
    id: '2',
    quote: 'A truly transformative experience. Their insights helped us navigate complex challenges with ease, leading to significant growth for our business.',
    author: 'Michael Rodriguez',
    title: 'Founder, Global Ventures',
    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
    rating: 4.5,
  },
  {
    id: '3',
    quote: 'Professional, efficient, and genuinely helpful. We saw immediate improvements after implementing their recommendations. A fantastic partner!',
    author: 'Jessica Lee',
    title: 'Marketing Director, Bright Future Inc.',
    avatarUrl: 'https://mui.com/static/images/avatar/3.jpg',
    rating: 5,
  },
  {
    id: '4',
    quote: 'From concept to execution, everything was seamless. The attention to detail and commitment to quality truly set them apart. We are thrilled with the outcome.',
    author: 'David Kim',
    title: 'CTO, Tech Innovations',
    avatarUrl: 'https://mui.com/static/images/avatar/4.jpg',
    rating: 4.5,
  },
];

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const theme = useTheme();
  // Use provided testimonials or fall back to defaults
  const actualTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 }, // Responsive padding top/bottom
        backgroundColor: theme.palette.grey[50], // Light background for the section
        color: theme.palette.text.primary,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            mb: { xs: 2, md: 3 },
            fontWeight: 700,
            fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' }, // Responsive font size
            color: theme.palette.primary.dark,
          }}
        >
          What Our Customers Say
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            mb: { xs: 6, md: 8 },
            color: theme.palette.text.secondary,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, // Responsive font size
            maxWidth: '800px',
            mx: 'auto', // Center the subtitle
          }}
        >
          Hear directly from those who've experienced the difference and achieved remarkable results with us.
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {actualTestimonials.map((testimonial) => (
            <Grid item xs={12} sm={6} md={4} key={testimonial.id}>
              <Card
                sx={{
                  height: '100%', // Ensure cards have uniform height
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: { xs: 2, md: 3 }, // Responsive padding inside the card
                  borderRadius: theme.shape.borderRadius * 2, // More rounded corners
                  boxShadow: theme.shadows[4], // Distinct elevation
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)', // Subtle lift on hover
                    boxShadow: theme.shadows[8], // Increased shadow on hover
                  },
                  backgroundColor: theme.palette.background.paper,
                  border: '1px solid ' + theme.palette.divider, // Subtle border
                }}
              >
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}> {/* Remove default CardContent padding */}
                  {testimonial.rating !== undefined && (
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      precision={0.5}
                      sx={{ mb: 2, color: theme.palette.warning.main }}
                      aria-label={String(testimonial.rating) + ' out of 5 stars'}
                    />
                  )}
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      mb: 3,
                      lineHeight: 1.6,
                      color: theme.palette.text.primary,
                      fontSize: { xs: '1rem', md: '1.125rem' },
                    }}
                  >
                    " {testimonial.quote} "
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      mt: 'auto', // Pushes the stack to the bottom if content above is shorter
                      pt: 2,
                      borderTop: '1px solid ' + theme.palette.divider, // Separator line
                    }}
                  >
                    <Avatar
                      src={testimonial.avatarUrl}
                      alt={testimonial.author}
                      sx={{
                        width: 60,
                        height: 60,
                        border: '2px solid ' + theme.palette.primary.light, // Avatar border
                      }}
                    />
                    <Box textAlign="left">
                      <Typography
                        variant="subtitle1"
                        component="h3"
                        fontWeight="bold"
                        sx={{ color: theme.palette.primary.main }}
                      >
                        {testimonial.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.title}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;