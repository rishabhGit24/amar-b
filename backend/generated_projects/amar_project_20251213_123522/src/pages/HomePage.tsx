import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import AboutSection from '../components/AboutSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const heroStyles = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '100px 20px',
    textAlign: 'center' as const,
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  const heroTitleStyles = {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '24px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  };

  const heroSubtitleStyles = {
    fontSize: '1.5rem',
    maxWidth: '700px',
    lineHeight: '1.8',
    opacity: 0.95,
  };

  const sectionStyles = {
    padding: '80px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    background: '#ffffff',
  };

  const sectionTitleStyles = {
    fontSize: '3rem',
    textAlign: 'center' as const,
    marginBottom: '60px',
    color: '#2d3748',
    fontWeight: 'bold',
  };

  const cardContainerStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
  };

  const featureCardStyles = {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    textAlign: 'center' as const,
  };

  const featureIconContainerStyles = {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const featureIconStyles = {
    fontSize: '2rem',
  };

  const featureTitleStyles = {
    fontSize: '1.8rem',
    color: '#2d3748',
    marginBottom: '16px',
    fontWeight: '600',
  };

  const featureDescriptionStyles = {
    color: '#718096',
    fontSize: '1.1rem',
    lineHeight: '1.8',
  };

  const buttonStyles = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '18px 48px',
    fontSize: '1.2rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  };

  return (
    <div>
      <Header />
      <Hero />

      <section style={sectionStyles}>
        <h2 style={sectionTitleStyles}>Our Delicious Menu</h2>
        <div style={cardContainerStyles}>
          <MenuSection />
        </div>
      </section>

      <section style={{ ...sectionStyles, background: '#f7fafc' }}>
        <h2 style={sectionTitleStyles}>About Our Story</h2>
        <AboutSection />
      </section>

      <section style={sectionStyles}>
        <h2 style={sectionTitleStyles}>Get In Touch</h2>
        <ContactForm />
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;