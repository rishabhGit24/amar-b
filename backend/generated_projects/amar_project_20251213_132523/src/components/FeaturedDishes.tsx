import React from 'react';


interface FeaturedDishesProps {
  dishes?: Array<{name: string, description: string, imageUrl: string, price?: string}>;
}

const FeaturedDishes: React.FC<FeaturedDishesProps> = ({ dishes = '' }) => {
  return (
    <div className="featureddishes">
      <h2>FeaturedDishes</h2>
      <p>Section showcasing a selection of the restaurant's most popular or signature dishes with images and descriptions.</p>
    </div>
  );
};

export default FeaturedDishes;
