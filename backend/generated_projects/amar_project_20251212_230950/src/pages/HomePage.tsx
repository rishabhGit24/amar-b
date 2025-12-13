import React from 'react';
import Header from '../components/Header.tsx';
import Hero from '../components/Hero.tsx';
import AboutAI from '../components/AboutAI.tsx';
import Features from '../components/Features.tsx';
import Footer from '../components/Footer.tsx';

const HomePage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f7fafc' }}>
      <Header />

      <Hero
        title="Unlock the Future with Intelligent AI"
        description="Experience the transformative power of Artificial Intelligence. From automating complex tasks to uncovering groundbreaking insights, our AI solutions are designed to propel your business forward."
        styles={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '120px 20px',
          textAlign: 'center',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
        titleStyles={{
          fontSize: '4.5rem',
          fontWeight: '800',
          marginBottom: '32px',
          textShadow: '0 8px 24px rgba(0,0,0,0.2)',
          lineHeight: '1.2',
        }}
        descriptionStyles={{
          fontSize: '1.7rem',
          maxWidth: '800px',
          lineHeight: '1.9',
          opacity: 0.98,
          letterSpacing: '0.5px',
        }}
      />

      <AboutAI
        title="What is Artificial Intelligence?"
        description="Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction. AI is rapidly evolving, impacting every industry and aspect of our lives."
        styles={{
          padding: '100px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
        titleStyles={{
          fontSize: '3.5rem',
          marginBottom: '40px',
          color: '#2d3748',
          fontWeight: '700',
        }}
        descriptionStyles={{
          fontSize: '1.3rem',
          color: '#4a5568',
          lineHeight: '2',
          maxWidth: '900px',
        }}
      />

      <Features
        title="Key AI Capabilities"
        features={[
          {
            icon: '💡',
            title: 'Machine Learning',
            description: 'Empower systems to learn from data, identify patterns, and make predictions with increasing accuracy.',
          },
          {
            icon: '🎯',
            title: 'Natural Language Processing',
            description: 'Enable machines to understand, interpret, and generate human language, fostering seamless communication.',
          },
          {
            icon: '⭐',
            title: 'Computer Vision',
            description: 'Allow AI to 'see' and interpret visual information from the world, powering applications from image recognition to autonomous vehicles.',
          },
          {
            icon: '✨',
            title: 'Predictive Analytics',
            description: 'Leverage historical data to forecast future trends and outcomes, enabling proactive decision-making.',
          },
        ]}
        styles={{
          padding: '100px 20px',
          background: '#f7fafc',
          textAlign: 'center',
        }}
        titleStyles={{
          fontSize: '3.5rem',
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: '700',
        }}
        cardStyles={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          border: '1px solid #e2e8f0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        cardIconStyles={{
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
        }}
        cardTitleStyles={{
          fontSize: '2rem',
          color: '#2d3748',
          marginBottom: '16px',
          fontWeight: '600',
        }}
        cardDescriptionStyles={{
          color: '#718096',
          fontSize: '1.15rem',
          lineHeight: '1.8',
        }}
        gridStyles={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      />

      <section style={{
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: '700',
        }}>
          Transform Your Business Today
        </h2>
        <p style={{
          fontSize: '1.4rem',
          color: '#4a5568',
          lineHeight: '2',
          maxWidth: '800px',
          margin: '0 auto 60px auto',
        }}>
          Don't get left behind. Embrace the power of AI to innovate, optimize, and lead in your industry. Discover how our tailored AI solutions can unlock new opportunities for growth and efficiency.
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 56px',
          fontSize: '1.3rem',
          fontWeight: '700',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          display: 'inline-block',
        }}>
          Request a Demo
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;