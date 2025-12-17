import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturedPizzasSection from '../components/FeaturedPizzasSection';
import CallToActionSection from '../components/CallToActionSection';

const HomePage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8f8f8', minHeight: '100vh', color: '#333' }}>
      <Header />

      {/* Hero Section Container */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center' as const,
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* The HeroSection component is expected to render its own title, description, and any internal elements */}
        <HeroSection />
      </div>

      {/* Featured Pizzas Section Container */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        marginTop: '-80px', // Overlap with hero for a modern look
        position: 'relative',
        zIndex: 1,
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold',
          letterSpacing: '-0.02em'
        }}>
          Our Most Loved Pizzas 🍕
        </h2>
        {/* The FeaturedPizzasSection component is expected to render the grid of pizza cards */}
        <FeaturedPizzasSection />
      </section>

      {/* Call To Action Section Container */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '100px auto',
        background: '#f0f4f8', // Lighter background for CTA
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
        textAlign: 'center' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '30px',
          color: '#2d3748',
          fontWeight: 'bold',
          letterSpacing: '-0.02em'
        }}>
          Ready for a Slice of Heaven? ✨
        </h2>
        <p style={{
          fontSize: '1.5rem',
          maxWidth: '800px',
          lineHeight: '1.8',
          color: '#4a5568',
          marginBottom: '40px',
          opacity: 0.9
        }}>
          Explore our full menu and order your favorite pizza today! Fast delivery, fresh taste, every time.
        </p>
        {/* The CallToActionSection component is expected to render its own button or interactive element */}
        <CallToActionSection />
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;