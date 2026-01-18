import React from 'react';


interface FeatureCardProps {
  icon?: string;
  title?: string;
  description?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon = '', title = '', description = '' }) => {
  return (
    <div className="featurecard">
      <h2>FeatureCard</h2>
      <p>A reusable component to display a single feature with an icon, title, and description.</p>
    </div>
  );
};

export default FeatureCard;
