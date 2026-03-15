import React, { FC } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

interface CallToActionSectionProps {
  text?: string;
  buttonLabel?: string;
  buttonLink?: string;
}

const CallToActionSection: FC<CallToActionSectionProps> = ({
  text = "Ready to elevate your digital presence? Discover how our solutions can transform your business.",
  buttonLabel = "Get Started Today",
  buttonLink = "#contact",
}) => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: theme.shape.borderRadius * 2,
            textAlign: 'center',
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: theme.shadows[10],
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at top left, rgba(255,255,255,0.05) 0%, transparent 60%)',
              zIndex: 0,
            },
          }}
        >
          <Stack
            spacing={{ xs: 3, md: 4 }}
            alignItems="center"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: 1.2,
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              {text}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href={buttonLink}
              aria-label={buttonLabel}
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                borderRadius: theme.shape.borderRadius * 1.5,
                fontWeight: 600,
                fontSize: { xs: '1rem', md: '1.125rem' },
                textTransform: 'none',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: theme.shadows[12],
                },
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: theme.palette.secondary.light,
                  outlineOffset: 2,
                },
              }}
            >
              {buttonLabel}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CallToActionSection;