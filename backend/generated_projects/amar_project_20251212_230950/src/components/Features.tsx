import React from 'react';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesProps {
  title?: string;
  featureItems?: FeatureItem[];
}

const Features: React.FC<FeaturesProps> = ({
  title = 'Key Features of Our AI',
  featureItems = [
    {
      icon: '💡',
      title: 'Intelligent Automation',
      description: 'Streamline your workflows with our AI-powered automation solutions.',
    },
    {
      icon: '📊',
      title: 'Data-Driven Insights',
      description: 'Uncover valuable patterns and make informed decisions with advanced analytics.',
    },
    {
      icon: '🚀',
      title: 'Enhanced User Experience',
      description: 'Deliver personalized and engaging experiences to your users.',
    },
  ],
}) => {
  return (
    <section className="features-section" aria-labelledby="features-heading">
      <h2 id="features-heading" className="features-title">
        {title}
      </h2>
      <div className="features-grid">
        {featureItems.map((item, index) => (
          <div key={index} className="feature-item" role="listitem">
            <div className="feature-icon">{item.icon}</div>
            <h3 className="feature-item-title">{item.title}</h3>
            <p className="feature-item-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;