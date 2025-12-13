import React from 'react';


interface FeaturedDishesSectionProps {
  dishes?: { id: string, name: string, description: string, imageUrl: string }[];
}

const FeaturedDishesSection: React.FC<FeaturedDishesSectionProps> = ({ dishes = '' }) => {
  return (
    <div className="featureddishessection">
      <h2>FeaturedDishesSection</h2>
      <p>Section displaying a selection of highlighted or popular dishes.</p>
    </div>
  );
};

export default FeaturedDishesSection;
