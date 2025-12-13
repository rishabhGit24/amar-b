import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutContent from '../components/AboutContent';

const AboutPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8f9fa', color: '#333', minHeight: '100vh', display: 'flex', flexDirection: 'column' as const }}>
      <Header />

      {/* Hero Section: Our Story */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center' as const,
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          Our Story: A Culinary Legacy 🌟
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}>
          For generations, we've poured our heart into crafting unforgettable dining experiences. Discover the journey that shaped our passion for food and hospitality.
        </p>
      </div>

      {/* Main Content Section: The Heart of Our Restaurant */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        marginTop: '-80px', // Overlap with hero for visual interest
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Our Culinary Philosophy & Roots 🍽️
        </h2>
        {/* The AboutContent component is expected to render the core story/background */}
        <AboutContent />
      </section>

      {/* Values Section: What Drives Us */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '80px auto',
        background: '#f0f2f5', // Slightly different background for contrast
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Values That Define Our Craft ✨
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {/* Feature Card 1: Quality Ingredients */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>🌱</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Uncompromising Quality
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              We meticulously select the freshest, highest-quality ingredients, prioritizing local and sustainable sourcing to ensure every dish is a masterpiece.
            </p>
          </div>

          {/* Feature Card 2: Passionate Craftsmanship */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>💖</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Artful Innovation
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Our chefs blend time-honored traditions with creative innovation, constantly exploring new flavors and techniques to surprise and delight your palate.
            </p>
          </div>

          {/* Feature Card 3: Exceptional Service */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>🤝</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Warm Hospitality
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Beyond the food, we are dedicated to creating a welcoming atmosphere where every guest feels cherished, making each visit a memorable occasion.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto 80px auto',
        textAlign: 'center' as const,
        background: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '30px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Join Our Story, Taste Our Passion! 🥂
        </h2>
        <p style={{ fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto 40px auto', lineHeight: '1.8', color: '#555' }}>
          We invite you to experience the dedication, the flavor, and the warmth that defines us. Book a table and let us create an unforgettable moment for you.
        </p>
        <button style={{
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
          letterSpacing: '1px'
        }}>
          Make a Reservation
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;