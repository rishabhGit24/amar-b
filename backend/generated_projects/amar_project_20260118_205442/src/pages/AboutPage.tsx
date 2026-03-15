import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutContent from '../components/AboutContent';

const AboutPage: React.FC = () => {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      color: '#2d3748',
      backgroundColor: '#f7fafc', // Light background for the whole page
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
    }}>
      <Header />

      <main style={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <section style={{
          padding: '120px 20px',
          background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
          textAlign: 'center' as const,
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            maxWidth: '900px',
            margin: '0 auto',
            zIndex: 1,
          }}>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '3px 3px 6px rgba(0,0,0,0.15)', color: '#2d3748', lineHeight: '1.1' }}>
              Our Story, Brewed with Passion ☕
            </h1>
            <p style={{ fontSize: '1.6rem', maxWidth: '750px', lineHeight: '1.8', opacity: 0.9, color: '#4a5568' }}>
              From a humble dream to a vibrant community hub, we've poured our heart and soul into every cup. Discover the journey that shaped our philosophy and commitment to exceptional coffee.
            </p>
          </div>
        </section>

        {/* Our Journey & Philosophy Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 15px 45px rgba(0,0,0,0.08)',
          marginTop: '-60px', // Overlap with hero for visual interest
          position: 'relative',
          zIndex: 2,
        }}>
          <h2 style={{
            fontSize: '3.2rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold',
            lineHeight: '1.2',
          }}>
            Our Journey, Our Passion, Our Promise ✨
          </h2>
          {/* AboutContent component is used here to encapsulate the main story */}
          <AboutContent />
        </section>

        {/* Our Core Values Section */}
        <section style={{
          padding: '100px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#f7fafc',
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold',
          }}>
            What Drives Us: Our Core Values 💡
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
          }}>
            {/* Feature Card 1: Quality */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #e2e8f0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column' as const,
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
              }}>
                <span style={{ fontSize: '2rem' }}>🌟</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Uncompromising Quality
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8', flexGrow: 1 }}>
                We meticulously source the finest beans from sustainable farms worldwide, ensuring every roast delivers a rich, unparalleled flavor profile. Our commitment to quality is in every sip.
              </p>
            </div>

            {/* Feature Card 2: Community */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #e2e8f0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column' as const,
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                borderRadius: '15px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
              }}>
                <span style={{ fontSize: '2rem' }}>🤝</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Fostering Community
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8', flexGrow: 1 }}>
                More than just a coffee shop, we are a gathering place. We believe in building connections, supporting local initiatives, and creating a warm, welcoming space for everyone.
              </p>
            </div>

            {/* Feature Card 3: Sustainability */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #e2e8f0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column' as const,
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '15px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
              }}>
                <span style={{ fontSize: '2rem' }}>🌱</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Sustainable Practices
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8', flexGrow: 1 }}>
                We are dedicated to minimizing our environmental footprint. From ethically sourced beans to eco-friendly packaging and waste reduction, sustainability is at the heart of our operations.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section style={{
          padding: '100px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textAlign: 'center' as const,
          color: 'white',
        }}>
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '25px',
            textShadow: '2px 2px 5px rgba(0,0,0,0.2)',
            lineHeight: '1.2',
          }}>
            Taste the Difference, Feel the Warmth ☕
          </h2>
          <p style={{
            fontSize: '1.4rem',
            maxWidth: '800px',
            margin: '0 auto 40px auto',
            lineHeight: '1.7',
            opacity: 0.9,
          }}>
            Ready to experience coffee crafted with care and passion? Visit us today and become a part of our story.
          </p>
          <button style={{
            background: 'white',
            color: '#764ba2',
            padding: '18px 48px',
            fontSize: '1.2rem',
            fontWeight: '700',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase' as const,
            letterSpacing: '1px',
            outline: 'none',
          }}>
            Explore Our Menu
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;