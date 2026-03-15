import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { RocketLaunch, Insights, SupportAgent } from '@mui/icons-material';

const Header = () => {
  return (
    <Box sx={{
      backgroundColor: 'primary.dark',
      color: 'common.white',
      py: 6,
      borderBottom: '1px solid',
      borderColor: 'primary.light',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
    }}>
      <Container maxWidth="lg">
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
              <RocketLaunch sx={{ fontSize: 48, mr: 2, color: 'secondary.main' }} />
              <Typography variant="h3" component="h1" sx={{
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'secondary.light'
              }}>
                Quantum Leap Solutions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
              <Button variant="contained" sx={{
                backgroundColor: 'secondary.main',
                color: 'primary.dark',
                '&:hover': { backgroundColor: 'secondary.light' },
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 600
              }}>
                <Insights sx={{ mr: 1 }} />
                Explore Features
              </Button>
              <Button variant="outlined" sx={{
                borderColor: 'secondary.main',
                color: 'secondary.main',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'secondary.light' },
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 600
              }}>
                <SupportAgent sx={{ mr: 1 }} />
                Contact Us
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
          <Typography variant="h5" component="h2" sx={{
            mb: 2,
            fontWeight: 500,
            color: 'secondary.light',
            lineHeight: 1.4
          }}>
            Empowering Your Business with Cutting-Edge AI and Data Intelligence
          </Typography>
          <Typography variant="body1" sx={{
            mb: 4,
            lineHeight: 1.8,
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.85)'
          }}>
            Welcome to Quantum Leap Solutions, your premier partner in navigating the complexities of the modern digital landscape. We specialize in delivering transformative artificial intelligence and robust data intelligence platforms designed to propel your enterprise forward. Our innovative suite of services is meticulously crafted to optimize operational efficiency, unlock unprecedented insights from vast datasets, and foster sustainable growth in an ever-evolving market. We understand that in today's competitive environment, leveraging advanced technology is not merely an advantage, but a necessity. Our commitment is to provide scalable, secure, and intuitive solutions that integrate seamlessly with your existing infrastructure, ensuring a smooth transition and immediate impact. From predictive analytics to automated decision-making systems, Quantum Leap Solutions is dedicated to empowering businesses to make smarter, faster, and more informed choices. We pride ourselves on a client-centric approach, ensuring that every solution is tailored to your unique business needs and strategic objectives. Our team of expert data scientists, AI engineers, and cloud architects work collaboratively to design and implement solutions that are not only powerful but also future-proof. Discover how our expertise in machine learning, deep learning, and big data processing can revolutionize your approach to business challenges, turning raw data into your most valuable asset. We offer comprehensive support and continuous innovation, ensuring that your investment in AI and data intelligence yields maximum returns. Join the ranks of forward-thinking organizations that are already experiencing the Quantum Leap difference, achieving unparalleled efficiency, enhanced decision-making capabilities, and a significant competitive edge in their respective industries. Embrace the future of business with a partner you can trust.
          </Typography>
          <Typography variant="body2" sx={{
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.7)',
            mt: 3
          }}>
            "Innovating for tomorrow, delivering excellence today."
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;