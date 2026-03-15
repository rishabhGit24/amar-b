import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Star } from '@mui/icons-material';


interface FeatureSectionProps {
  features?: Array<string>;
  children?: React.ReactNode;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ features = '', children }) => {
  return (
    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, textAlign: 'center' }}>
      <CardContent>
        <Box sx={{ color: 'primary.main', mb: 2, fontSize: '2.5rem' }}>
          <Star />
        </Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
          FeatureSection
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}>
          Grid highlighting signature offerings and benefits. - This component provides exceptional functionality with a beautiful, 
          professional design that enhances user experience and drives engagement.
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
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureSection;
