import React from 'react';


interface FeaturedDishesProps {
  dishes?: { name: string; description: string; price: string; imageUrl: string; altText: string; }[];
}

const FeaturedDishes: React.FC<FeaturedDishesProps> = ({ dishes = '' }) => {
  return (
    <div className="featureddishes">
      <h2>FeaturedDishes</h2>
      <p>Section displaying a selection of popular or signature dishes with images and descriptions.</p>
    </div>
  );
};

export default FeaturedDishes;
