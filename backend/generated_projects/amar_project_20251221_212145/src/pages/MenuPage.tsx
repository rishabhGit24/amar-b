import React from 'react';
import MenuSection from '../components/MenuSection';

const MenuPage: React.FC = () => {
  return (
    <div className="page-content">
      <div className="container">
        <h1>Menu</h1>
        <p>Comprehensive menu page displaying all available pizzas, pastas, salads, appetizers, and beverages with detailed descriptions and pricing.</p>
        <MenuSection />
      </div>
    </div>
  );
};

export default MenuPage;
