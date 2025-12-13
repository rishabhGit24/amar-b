import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutStorySection from '../components/AboutStorySection';

const AboutPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8f8f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' as const }}>
      <Header />

      {/* Hero Section */}
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
          From humble beginnings to a celebrated dining destination, discover the heart and soul poured into every dish and every moment at our restaurant.
        </p>
      </div>

      {/* Main Story Content - Using the dedicated AboutStorySection component */}
      <AboutStorySection />

      {/* Our Philosophy Section */}
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
          Our Guiding Principles ✨
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {/* Feature Card 1: Freshness */}
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
              <span style={{ fontSize: '2rem' }}>🌿</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Unwavering Freshness
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              We believe the best dishes start with the best ingredients. Our commitment to sourcing fresh, local produce and premium meats is paramount.
            </p>
          </div>

          {/* Feature Card 2: Craftsmanship */}
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
              <span style={{ fontSize: '2rem' }}>👨‍🍳</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Artisanal Craftsmanship
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Every plate is a canvas, and our chefs are artists. We blend traditional techniques with innovative flair to create culinary masterpieces.
            </p>
          </div>

          {/* Feature Card 3: Experience */}
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
              <span style={{ fontSize: '2rem' }}>🥂</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Unforgettable Experience
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Beyond the food, we strive to create an ambiance where every visit is a celebration, filled with warmth, impeccable service, and joy.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center' as const,
        background: '#f8f8f8'
      }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '30px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Join Our Journey 🚀
        </h2>
        <p style={{
          fontSize: '1.5rem',
          maxWidth: '800px',
          margin: '0 auto 40px auto',
          lineHeight: '1.8',
          color: '#4a5568'
        }}>
          We invite you to experience the culmination of our passion and dedication. Come dine with us and create your own cherished memories.
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
          Reserve Your Table
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;