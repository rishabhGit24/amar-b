import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutAISection from '../components/AboutAISection';
import FeaturesSection from '../components/FeaturesSection';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f7fafc' }}>
      <Header />

      <HeroSection
        title="Unlock the Future with AI"
        description="Experience the power of artificial intelligence to transform your ideas into reality. Our cutting-edge solutions drive innovation and efficiency."
        buttonText="Explore Our Solutions"
        buttonLink="/solutions"
      />

      <AboutAISection
        title="What is AI?"
        description="Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction. AI is rapidly evolving, impacting every facet of our lives, from personalized recommendations to complex scientific research."
        imageUrl="https://images.unsplash.com/photo-1518770660435-43b07b789b3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      />

      <FeaturesSection
        title="Why Choose Our AI?"
        features={[
          {
            icon: '💡',
            title: 'Intelligent Automation',
            description: 'Streamline your workflows and boost productivity with AI-powered automation that learns and adapts.',
          },
          {
            icon: '⭐',
            title: 'Data-Driven Insights',
            description: 'Uncover hidden patterns and make informed decisions with advanced AI analytics.',
          },
          {
            icon: '🎯',
            title: 'Personalized Experiences',
            description: 'Deliver tailored experiences to your users, enhancing engagement and satisfaction.',
          },
          {
            icon: '✨',
            title: 'Predictive Power',
            description: 'Anticipate future trends and outcomes with sophisticated AI forecasting models.',
          },
        ]}
      />

      <CallToAction
        title="Ready to Innovate?"
        description="Join the AI revolution and discover how our technology can empower your business. Get started today!"
        buttonText="Get Started Now"
        buttonLink="/signup"
      />

      <Footer />
    </div>
  );
};

export default HomePage;