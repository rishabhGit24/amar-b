import React from 'react';


interface FeaturedDishesProps {
  dishes: Array<{ name: string, description: string, imageUrl: string }>;
}

const FeaturedDishes: React.FC<FeaturedDishesProps> = (props: FeaturedDishesProps) => {
  return (
    <div className="featureddishes">
      <h2>FeaturedDishes</h2>
      <p>Displays a selection of the restaurant's most popular or signature dishes.</p>
    </div>
  );
};

export default FeaturedDishes;
