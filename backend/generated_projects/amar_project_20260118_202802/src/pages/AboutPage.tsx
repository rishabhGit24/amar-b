import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';

const AboutPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#2d3748', backgroundColor: '#f7fafc' }}>
      <Header />

      {/* Hero Section: Our Journey */}
      <section style={{
        padding: '120px 20px',
        background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)', // Warm, inviting gradient
        textAlign: 'center' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        minHeight: '60vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          zIndex: 1
        }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '3px 3px 6px rgba(0,0,0,0.15)', color: '#4a2c2a' }}>
            Our Journey, One Cup at a Time
          </h1>
          <p style={{ fontSize: '1.6rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.95, color: '#5a4a42' }}>
            Discover the heart behind every brew at [Coffee Shop Name]. We're more than just coffee; we're a community built on passion, quality, and a shared love for exceptional moments.
          </p>
        </div>
      </section>

      {/* AboutSection Component - For the main story/mission */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
        marginTop: '-60px', // Overlap with hero for visual interest
        position: 'relative',
        zIndex: 2
      }}>
        <AboutSection /> {/* Using the provided component without props */}
      </section>

      {/* Our Mission & Values Section */}
      <section style={{
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#f7fafc'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          textAlign: 'center' as const,
          marginBottom: '70px',
          color: '#4a2c2a',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
        }}>
          Our Core Values ✨
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px'
        }}>
          {/* Value Card 1: Uncompromising Quality */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // Warm gradient
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>☕</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#4a2c2a', marginBottom: '16px', fontWeight: '600' }}>
              Uncompromising Quality
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              From bean to cup, we meticulously source the finest coffee beans globally and roast them to perfection. Every sip is a testament to our dedication to excellence.
            </p>
          </div>

          {/* Value Card 2: Fostering Community */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // Fresh gradient
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>🤝</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#4a2c2a', marginBottom: '16px', fontWeight: '600' }}>
              Fostering Community
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              We believe coffee brings people together. Our space is designed to be a warm, inviting hub where connections are made and stories are shared.
            </p>
          </div>

          {/* Value Card 3: Sustainable Practices */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', // Cool gradient
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>🌱</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#4a2c2a', marginBottom: '16px', fontWeight: '600' }}>
              Sustainable Practices
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Committed to a better planet, we partner with ethical farms and implement eco-friendly practices throughout our operations, from sourcing to waste reduction.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Provided button gradient
        textAlign: 'center' as const,
        color: 'white',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '30px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Experience the Difference
        </h2>
        <p style={{
          fontSize: '1.5rem',
          maxWidth: '800px',
          lineHeight: '1.8',
          marginBottom: '50px',
          opacity: 0.9
        }}>
          Join us for a cup and become part of our story. We look forward to welcoming you to our coffee family.
        </p>
        <button style={{
          background: 'white', // Inverted for contrast against the purple gradient
          color: '#764ba2',
          padding: '18px 48px',
          fontSize: '1.2rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px'
        }}>
          Find Our Location 📍
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;