import React from 'react';


interface FeaturesSectionProps {
  features?: array;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features = [] }) => {
  return (
    <div className="featuressection">
      <h2>FeaturesSection</h2>
      <p>Section highlighting key features of the coffee shop.</p>
    </div>
  );
};

export default FeaturesSection;
