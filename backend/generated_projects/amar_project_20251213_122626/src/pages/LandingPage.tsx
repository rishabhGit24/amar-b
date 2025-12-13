import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import MenuHighlights from '../components/MenuHighlights';
import OpeningHours from '../components/OpeningHours';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <Header />

      <HeroSection />

      <AboutSection />

      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#f8f9fa'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Our Signature Menu Highlights ⭐
        </h2>
        <MenuHighlights />
      </section>

      <OpeningHours />

      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Get In Touch ☕
        </h2>
        <ContactForm />
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;