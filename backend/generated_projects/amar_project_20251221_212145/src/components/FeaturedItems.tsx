import React from 'react';


interface FeaturedItemsProps {
  items?: string[];
}

const FeaturedItems: React.FC<FeaturedItemsProps> = ({ items = [] }) => {
  return (
    <div className="featureditems">
      <h2>FeaturedItems</h2>
      <p>Section on the homepage showcasing popular or special menu items, enticing users with images and brief descriptions of best-selling pizzas or daily specials.</p>
    </div>
  );
};

export default FeaturedItems;
