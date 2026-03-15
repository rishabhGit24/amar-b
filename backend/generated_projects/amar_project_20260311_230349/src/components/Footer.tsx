import React from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  IconButton,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

/**
 * Defines the structure for a social media link.
 */
interface SocialLink {
  /** The Material UI icon component to display. */
  icon: React.ReactNode;
  /** The URL to navigate to when the link is clicked. */
  href: string;
  /** An accessible label for the social media link, used for aria-label. */
  label: string;
}

/**
 * Props for the Footer component.
 */
interface FooterProps {
  /**
   * An optional array of social media links to display.
   * If not provided, a default set of links will be used.
   */
  socialLinks?: SocialLink[];
}

/**
 * A production-ready, visually polished, and accessible Footer component
 * featuring copyright information, social media links, and quick navigation.
 *
 * It uses Material UI primitives exclusively for layout and styling,
 * adheres to strict TypeScript typing, and provides sensible defaults.
 *
 * @param {FooterProps} props - The props for the Footer component.
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer: React.FC<FooterProps> = ({ socialLinks }) => {
  const theme = useTheme();

  // Default social links if none are provided
  const defaultSocialLinks: SocialLink[] = [
    { icon: <FacebookIcon />, href: "https://facebook.com", label: "Facebook" },
    { icon: <TwitterIcon />, href: "https://twitter.com", label: "Twitter" },
    { icon: <InstagramIcon />, href: "https://instagram.com", label: "Instagram" },
    { icon: <LinkedInIcon />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  // Use provided social links or fall back to defaults
  const currentSocialLinks = socialLinks || defaultSocialLinks;

  // Internal navigation links
  const navLinks = [
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ];

  // Internal legal links
  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        py: { xs: 4, md: 6 }, // Responsive vertical padding
        borderTop: "1px solid " + theme.palette.divider,
        boxShadow: theme.shadows[3], // Subtle elevation
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }} // Stack vertically on small screens, horizontally on medium+
          spacing={{ xs: 4, md: 8 }} // Responsive spacing between sections
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "flex-start" }} // Center items on mobile, align to start on desktop
          sx={{ mb: { xs: 4, md: 6 } }} // Margin bottom for the main content stack
        >
          {/* Company Info / Branding Section */}
          <Stack spacing={1} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
              Your Company
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 300, textAlign: { xs: "center", md: "left" } }}>
              Innovating solutions for a better tomorrow.
            </Typography>
          </Stack>

          {/* Quick Navigation Links Section */}
          <Stack spacing={1} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
              Quick Links
            </Typography>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                color="inherit"
                underline="hover"
                variant="body2"
                sx={{
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                  transition: "color 0.2s ease-in-out", // Smooth hover effect
                }}
              >
                {link.name}
              </Link>
            ))}
          </Stack>

          {/* Social Media Links Section */}
          <Stack spacing={1} alignItems={{ xs: "center", md: "flex-start" }}>
            <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
              Connect With Us
            </Typography>
            <Stack direction="row" spacing={1}>
              {currentSocialLinks.map((link) => (
                <IconButton
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer" // Security best practice for external links
                  aria-label={link.label} // Essential for accessibility
                  color="inherit"
                  sx={{
                    "&:hover": {
                      color: theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                    },
                    transition: "color 0.2s ease-in-out, background-color 0.2s ease-in-out", // Smooth hover effect
                  }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: { xs: 3, md: 4 } }} /> {/* Visual separator */}

        {/* Bottom Section: Copyright and Legal Links */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2, md: 4 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" sx={{ textAlign: { xs: "center", md: "left" } }}>
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                color="inherit"
                underline="hover"
                variant="body2"
                sx={{
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                  transition: "color 0.2s ease-in-out", // Smooth hover effect
                }}
              >
                {link.name}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;