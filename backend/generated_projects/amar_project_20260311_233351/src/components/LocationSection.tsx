import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

// --- Type Definitions ---
interface OperatingHour {
  day: string;
  time: string;
}

interface LocationSectionProps {
  address?: string;
  hours?: OperatingHour[];
  mapEmbed?: string;
}

// --- Default Values ---
const defaultAddress = "123 Tech Avenue, Innovation City, TX 78701";
const defaultHours: OperatingHour[] = [
  { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
  { day: "Saturday", time: "10:00 AM - 4:00 PM" },
  { day: "Sunday", time: "Closed" },
];
// A generic Google Maps embed for a fictional location (e.g., a business in Austin, TX)
const defaultMapEmbed =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.936802528751!2d-97.7430608848786!3d30.26715308179927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0cc032f%3A0x5d9d1b6f217f2e2!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1678912345678!5m2!1sen!2sus";

const LocationSection: React.FC<LocationSectionProps> = ({
  address = defaultAddress,
  hours = defaultHours,
  mapEmbed = defaultMapEmbed,
}) => {
  // Construct a Google Maps URL for the address for the "Open in Google Maps" button
  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(address);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: "grey.50", // Light background for the section
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            mb: { xs: 4, md: 8 },
            fontWeight: 700,
            color: "primary.dark",
            textShadow: "1px 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          Visit Our Location
        </Typography>

        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Left Column: Address and Hours */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              {/* Address Card */}
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.08)",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <LocationOnIcon color="primary" sx={{ fontSize: 32 }} />
                  <Typography
                    variant="h5"
                    component="h3"
                    fontWeight={600}
                    color="primary.main"
                  >
                    Our Address
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {address}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MapIcon />}
                  component={Link}
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open address in Google Maps"
                  sx={{
                    mt: 2,
                    py: 1.2,
                    px: 3,
                    borderRadius: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  Open in Google Maps
                </Button>
              </Paper>

              {/* Operating Hours Card */}
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.08)",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <AccessTimeIcon color="primary" sx={{ fontSize: 32 }} />
                  <Typography
                    variant="h5"
                    component="h3"
                    fontWeight={600}
                    color="primary.main"
                  >
                    Operating Hours
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  {hours.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 0.5,
                        borderBottom:
                          index < hours.length - 1
                            ? "1px dashed rgba(0,0,0,0.1)"
                            : "none",
                      }}
                    >
                      <Typography variant="body1" fontWeight={500}>
                        {item.day}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {item.time}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column: Embedded Map */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: { xs: 2, md: 3 }, // Slightly less padding for the map container
                borderRadius: 2,
                backgroundColor: "background.paper",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.08)",
                height: "100%", // Ensure map takes full height of its grid item
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                fontWeight={600}
                color="primary.main"
                mb={2}
              >
                Find Us Easily
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "56.25%", // 16:9 Aspect Ratio (height / width = 9 / 16 = 0.5625)
                  height: 0,
                  overflow: "hidden",
                  borderRadius: 1,
                  flexGrow: 1, // Allow map to take available space
                }}
              >
                <iframe
                  src={mapEmbed}
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: "4px",
                  }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                  aria-label="Embedded Google Map showing our location"
                ></iframe>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LocationSection;
