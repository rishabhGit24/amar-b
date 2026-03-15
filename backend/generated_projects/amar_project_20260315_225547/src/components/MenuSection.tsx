import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Star } from '@mui/icons-material';


interface MenuSectionProps {
  menuCategories?: Array<string>;
  children?: React.ReactNode;
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuCategories = '', children }) => {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, textAlign: 'center' }}>
      <CardContent>
        <Box sx={{ color: 'primary.main', mb: 2, fontSize: '2.5rem' }}>
          <Star />
        </Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
          MenuSection
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}>
          Menu listing grouped by category with pricing.
        </Typography>
        {children && (
          <Box sx={{ mt: 3 }}>
            {children}
          </Box>
        )}
        <Button 
          variant="contained" 
          sx={{ mt: 2, px: 3, py: 1 }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuSection;
