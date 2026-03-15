import React from 'react';


interface MenuShowcaseSectionProps {
  title?: string;
  menuItems?: string[];
}

const MenuShowcaseSection: React.FC<MenuShowcaseSectionProps> = ({ title = '', menuItems = [] }) => {
  return (
    <div className="menushowcasesection">
      <h2>MenuShowcaseSection</h2>
      <p>Section displaying a selection of popular coffee drinks and pastries with descriptions and prices.</p>
    </div>
  );
};

export default MenuShowcaseSection;
