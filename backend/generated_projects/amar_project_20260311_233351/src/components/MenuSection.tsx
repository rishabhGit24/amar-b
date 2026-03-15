import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

interface MenuSectionProps {
  title: string;
  description: string;
  items: MenuItem[];
}

const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  description,
  items,
}) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "primary.dark",
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: "text.secondary",
          lineHeight: 1.7,
          maxWidth: "900px",
        }}
      >
        {description}
      </Typography>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: "100%",
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: "text.secondary",
                    lineHeight: 1.6,
                    minHeight: "60px",
                  }}
                >
                  {item.description}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "secondary.main",
                  }}
                >
                  {item.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuSection;
