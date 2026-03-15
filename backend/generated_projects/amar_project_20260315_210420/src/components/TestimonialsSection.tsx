import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface TestimonialsSectionProps {
  children?: React.ReactNode;
}

interface Testimonial {
  id: string;
  name: string;
  title: string;
  rating: number;
  quote: string;
  avatarUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Marketing Director',
    rating: 5,
    quote: 'AMAR has revolutionized our workflow. The intuitive design and robust features have significantly boosted our team\'s productivity and collaboration. Highly recommended!',
    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
  },
  {
    id: '2',
    name: 'David Lee',
    title: 'Product Manager',
    rating: 4.5,
    quote: 'The support from AMAR is exceptional. Any questions or issues are addressed promptly and effectively. The platform itself is incredibly versatile and adaptable to our needs.',
    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
  },
  {
    id: '3',
    name: 'Maria Garcia',
    title: 'Operations Lead',
    rating: 5,
    quote: 'We\'ve seen a remarkable improvement in our project management since adopting AMAR. The analytics tools provide invaluable insights, helping us make data-driven decisions.',
    avatarUrl: 'https://mui.com/static/images/avatar/3.jpg',
  },
  {
    id: '4',
    name: 'John Smith',
    title: 'Software Engineer',
    rating: 4,
    quote: 'As a developer, I appreciate the clean architecture and extensibility of AMAR. It integrates seamlessly with our existing tech stack, making development a breeze.',
    avatarUrl: 'https://mui.com/static/images/avatar/4.jpg',
  },
];

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: theme.palette.primary.main,
            fontSize: { xs: '2.25rem', md: '3rem' },
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
            maxWidth: '700px',
            mx: 'auto',
          }}
        >
          Hear directly from the businesses and individuals who trust AMAR to power their success.
        </Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 4 }}
          justifyContent="center"
          alignItems="stretch"
          sx={{
            flexWrap: 'wrap',
            '& > *': {
              flexBasis: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 21.33px)', lg: 'calc(25% - 24px)' },
              maxWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 21.33px)', lg: 'calc(25% - 24px)' },
            },
          }}
        >
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              elevation={4}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: theme.shape.borderRadius,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'left',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Rating
                  name={'read-only-rating-' + testimonial.id}
                  value={testimonial.rating}
                  readOnly
                  precision={0.5}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', color: theme.palette.text.secondary }}>
                  "{testimonial.quote}"
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 'auto' }}>
                  <Avatar
                    src={testimonial.avatarUrl}
                    alt={testimonial.name}
                    sx={{ width: 56, height: 56, border: '2px solid ' + theme.palette.primary.light }}
                  />
                  <Box>
                    <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {testimonial.title}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
        {children}
      </Container>
    </Box>
  );
};

export default TestimonialsSection;