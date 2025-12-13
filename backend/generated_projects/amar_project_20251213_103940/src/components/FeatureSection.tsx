import React from 'react';


interface FeatureSectionProps {
  title: string;
  features: Array<{icon: string, text: string}>;
}

const FeatureSection: React.FC<FeatureSectionProps> = (props: FeatureSectionProps) => {
  return (
    <div className="featuresection">
      <h2>FeatureSection</h2>
      <p>Section to highlight key aspects, skills, or features related to 'i' using icons and descriptive text.</p>
    </div>
  );
};

export default FeatureSection;
