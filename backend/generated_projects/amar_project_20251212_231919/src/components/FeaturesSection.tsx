import React from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title: string;
  features: Feature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ title, features }) => {
  // Provide meaningful default content if no props are provided
  const sectionTitle = title || 'Key AI Features';
  const sectionFeatures = features && features.length > 0 ? features : [
    {
      icon: '💡', // Placeholder for an actual icon component or SVG
      title: 'Intelligent Automation',
      description: 'Streamline your workflows with AI-powered automation, reducing manual effort and increasing efficiency.',
    },
    {
      icon: '📊', // Placeholder for an actual icon component or SVG
      title: 'Data-Driven Insights',
      description: 'Uncover hidden patterns and gain actionable insights from your data with advanced AI analytics.',
    },
    {
      icon: '🤖', // Placeholder for an actual icon component or SVG
      title: 'Personalized Experiences',
      description: 'Deliver tailored experiences to your users by leveraging AI to understand their preferences.',
    },
  ];

  return (
    <section className="features-section" aria-labelledby="features-section-title">
      <h2 id="features-section-title" className="features-section__title">
        {sectionTitle}
      </h2>
      <div className="features-section__grid">
        {sectionFeatures.map((feature, index) => (
          <article key={index} className="features-section__feature-card">
            <div className="features-section__feature-icon" aria-hidden="true">
              {feature.icon}
            </div>
            <h3 className="features-section__feature-title">{feature.title}</h3>
            <p className="features-section__feature-description">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;