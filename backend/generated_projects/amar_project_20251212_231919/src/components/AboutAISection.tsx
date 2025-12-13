import React from 'react';

interface AboutAISectionProps {
  title: string;
  content: string;
  imageUrl: string;
}

const AboutAISection: React.FC<AboutAISectionProps> = ({
  title = 'What is Artificial Intelligence?',
  content = 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. AI is a broad field of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence.',
  imageUrl = 'https://via.placeholder.com/400x300?text=AI+Illustration',
}) => {
  return (
    <section className="about-ai-section" aria-labelledby="about-ai-title">
      <div className="about-ai-container">
        <div className="about-ai-text-content">
          <h2 id="about-ai-title" className="about-ai-title">
            {title}
          </h2>
          <p className="about-ai-content">{content}</p>
        </div>
        <div className="about-ai-image-container">
          <img
            src={imageUrl}
            alt="Illustration representing Artificial Intelligence"
            className="about-ai-image"
            loading="lazy"
            aria-hidden="true" // Decorative image, content is in text
          />
        </div>
      </div>
    </section>
  );
};

export default AboutAISection;