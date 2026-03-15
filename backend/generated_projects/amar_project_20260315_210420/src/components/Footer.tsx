import React from 'react';
import { Box, Container, Typography, Stack, Link, IconButton, useTheme } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  const theme = useTheme();

  const companyName: string = "AMAR Solutions";
  const companyDescription: string = "Empowering businesses with innovative digital solutions and exceptional service.";
  const currentYear: number = new Date().getFullYear();

  const navLinks: Array<{ name: string; href: string }> = [
    { name: "Home", href: "#" },
    { name: "Services", href: "#services" },
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Privacy Policy", href: "#privacy" },
  ];

  const contactInfo: Array<{ label: string; value: string }> = [
    { label: "Address", value: "123 Tech Lane, Innovation City, TX 78701" },
    { label: "Phone", value: "+1 (555) 123-4567" },
    { label: "Email", value: "info@amarsolutions.com" },
  ];

  const socialLinks: Array<{ icon: React.ReactElement; href: string; label: string }> = [
    { icon: <FacebookIcon />, href: "https://facebook.com/amarsolutions", label: "Facebook" },
    { icon: <TwitterIcon />, href: "https://twitter.com/amarsolutions", label: "Twitter" },
    { icon: <InstagramIcon />, href: "https://instagram.com/amarsolutions", label: "Instagram" },
    { icon: <LinkedInIcon />, href: "https://linkedin.com/company/amarsolutions", label: "LinkedIn" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        py: { xs: 4, md: 6 },
        mt: 'auto',
        borderTop: '1px solid ' + theme.palette.divider,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 4, md: 8 }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-start' }}
          flexWrap="wrap"
        >
          {/* Company Info Section */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 700 }}>
              {companyName}
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 300, mb: 2 }}>
              {companyDescription}
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social, index: number) => (
                <IconButton
                  key={index}
                  aria-label={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: theme.palette.primary.contrastText }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* Navigation Links Section */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 20%' } }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {navLinks.map((link, index: number) => (
                <Link
                  key={index}
                  href={link.href}
                  color="inherit"
                  underline="hover"
                  variant="body2"
                  sx={{
                    '&:hover': {
                      color: theme.palette.secondary.light,
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Contact Info Section */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Stack spacing={1}>
              {contactInfo.map((item, index: number) => (
                <Typography key={index} variant="body2">
                  {item.label}: {item.value}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>

        {children}

        {/* Copyright Section */}
        <Box sx={{
          borderTop: '1px solid ' + theme.palette.divider,
          pt: 3,
          mt: 4,
          textAlign: 'center',
        }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            &copy; {currentYear} {companyName}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;