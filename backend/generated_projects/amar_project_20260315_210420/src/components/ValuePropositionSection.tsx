import React from 'react';
import { Box, Container, Typography, Stack, Card, CardContent, useTheme } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

interface ValuePropositionSectionProps {
  children?: React.ReactNode;
}

const ValuePropositionSection: React.FC<ValuePropositionSectionProps> = ({ children }) => {
  const theme = useTheme();

  const propositions = [
    {
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Unmatched Reliability',
      description: 'Experience consistent performance and uptime with our robust infrastructure, designed for mission-critical applications.',
    },
    {
      icon: <LightbulbOutlinedIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: 'Innovative Solutions',
      description: 'Stay ahead with cutting-edge features and continuous innovation, tailored to evolve with your business needs.',
    },
    {
      icon: <RocketLaunchOutlinedIcon sx={{ fontSize: 48, color: theme.palette.info.main }} />,
      title: 'Accelerated Growth',
      description: 'Leverage powerful tools and insights that empower your team to achieve new levels of productivity and market reach.',
    },
    {
      icon: <SecurityOutlinedIcon sx={{ fontSize: 48, color: theme.palette.success.main }} />,
      title: 'Enterprise-Grade Security',
      description: 'Protect your data with industry-leading security protocols and compliance standards, ensuring peace of mind.',
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Box sx={{ textAlign: 'center', maxWidth: 700 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2.25rem', md: '3rem' },
                lineHeight: 1.2,
              }}
            >
              Why Choose AMAR?
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
              }}
            >
              Discover the core advantages that set us apart and drive success for our partners.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 4, md: 3 }}
            justifyContent="center"
            alignItems="stretch"
            sx={{ width: '100%' }}
          >
            {propositions.map((prop, index) => (
              <Card
                key={index}
                elevation={4}
                sx={{
                  flex: 1,
                  minWidth: { xs: '100%', md: '280px' },
                  maxWidth: { xs: '100%', md: '350px' },
                  p: { xs: 3, md: 4 },
                  borderRadius: theme.shape.borderRadius * 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ mb: 3 }}>
                    {prop.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: theme.palette.primary.dark,
                    }}
                  >
                    {prop.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {prop.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
          {children}
        </Stack>
      </Container>
    </Box>
  );
};

export default ValuePropositionSection;