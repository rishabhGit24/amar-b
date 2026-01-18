import React from 'react';


interface FeaturesSectionProps {
  features?: Array<{ icon: string; title: string; description: string }>;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features = '' }) => {
  return (
    <div className="featuressection">
      <h2>FeaturesSection</h2>
      <p>Highlights 3 key features of the coffee shop using individual feature cards.</p>
    </div>
  );
};

export default FeaturesSection;
