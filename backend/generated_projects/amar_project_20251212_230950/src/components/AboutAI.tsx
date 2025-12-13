import React from 'react';

interface AboutAIProps {
  title?: string;
  content?: string;
}

const AboutAI: React.FC<AboutAIProps> = ({
  title = "What is Artificial Intelligence?",
  content = "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. AI is an evolving field that aims to create intelligent machines capable of performing tasks that typically require human intelligence, such as learning, problem-solving, decision-making, and understanding natural language. Its significance lies in its potential to revolutionize industries, enhance human capabilities, and address complex global challenges."
}) => {
  return (
    <section className="about-ai-section" aria-labelledby="about-ai-title">
      <h2 id="about-ai-title" className="about-ai-title">
        {title}
      </h2>
      <p className="about-ai-content">
        {content}
      </p>
    </section>
  );
};

export default AboutAI;