import React from 'react';


interface CategoriesOverviewProps {
  categories?: Category[];
}

const CategoriesOverview: React.FC<CategoriesOverviewProps> = ({ categories = [] }) => {
  return (
    <div className="categoriesoverview">
      <h2>CategoriesOverview</h2>
      <p>Presents an overview of product categories, enabling users to browse different sections.</p>
    </div>
  );
};

export default CategoriesOverview;
