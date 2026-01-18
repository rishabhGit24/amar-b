import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import MenuPreviewSection from '../components/MenuPreviewSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <HeroSection>
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            minHeight: '80vh', // Ensure hero takes up significant vertical space
            textAlign: 'center' as const,
            padding: '40px 20px',
            background: 'linear-gradient(180deg, #fdfcfb 0%, #ebedee 100%)', // Subtle background
            color: '#2d3748'
          }}>
            <h1 style={{
              fontSize: '4.5rem',
              fontWeight: 'bold',
              marginBottom: '24px',
              textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
              color: '#333',
              letterSpacing: '-1px'
            }}>
              Brew Haven: Your Daily Escape ☕
            </h1>
            <p style={{
              fontSize: '1.6rem',
              maxWidth: '800px',
              lineHeight: '1.7',
              opacity: 0.9,
              marginBottom: '40px',
              color: '#4a5568'
            }}>
              Discover the perfect blend of artisanal coffee, delightful pastries, and a cozy ambiance. Start your day right or unwind with us in a space crafted for comfort and connection.
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '18px 48px',
              fontSize: '1.3rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 12px 35px rgba(102, 126, 234, 0.45)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase' as const,
              letterSpacing: '1px',
              outline: 'none'
            }}>
              Explore Our Menu
            </button>
          </div>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection>
          <section style={{
            padding: '100px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: '#f9fafa', // Light background for contrast
            borderRadius: '25px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.05)',
            marginTop: '60px',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '3.5rem',
              textAlign: 'center' as const,
              marginBottom: '70px',
              color: '#2d3748',
              fontWeight: 'bold',
              letterSpacing: '-0.5px'
            }}>
              Why Choose Brew Haven? ✨
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '50px'
            }}>
              {/* Feature Card 1 */}
              <div style={{
                background: 'white',
                padding: '45px',
                borderRadius: '25px',
                boxShadow: '0 25px 70px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column' as const,
                justifyContent: 'flex-start' as const
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // Warm gradient
                  borderRadius: '18px',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const
                }}>
                  <span style={{ fontSize: '2.5rem' }}>☕</span>
                </div>
                <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '18px', fontWeight: '700' }}>
                  Artisanal Roasts
                </h3>
                <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.9' }}>
                  Experience meticulously sourced beans, expertly roasted to perfection for a rich, unforgettable flavor in every cup.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div style={{
                background: 'white',
                padding: '45px',
                borderRadius: '25px',
                boxShadow: '0 25px 70px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column' as const,
                justifyContent: 'flex-start' as const
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', // Cool gradient
                  borderRadius: '18px',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🛋️</span>
                </div>
                <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '18px', fontWeight: '700' }}>
                  Cozy Ambiance
                </h3>
                <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.9' }}>
                  Relax in our inviting space, thoughtfully designed for comfort and connection, perfect for work or leisure.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div style={{
                background: 'white',
                padding: '45px',
                borderRadius: '25px',
                boxShadow: '0 25px 70px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column' as const,
                justifyContent: 'flex-start' as const
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // Fresh gradient
                  borderRadius: '18px',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🥐</span>
                </div>
                <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '18px', fontWeight: '700' }}>
                  Freshly Baked Delights
                </h3>
                <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.9' }}>
                  Pair your coffee with our daily selection of pastries, baked fresh with love and premium ingredients.
                </p>
              </div>

              {/* Feature Card 4 */}
              <div style={{
                background: 'white',
                padding: '45px',
                borderRadius: '25px',
                boxShadow: '0 25px 70px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column' as const,
                justifyContent: 'flex-start' as const
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', // Soft gradient
                  borderRadius: '18px',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🤝</span>
                </div>
                <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '18px', fontWeight: '700' }}>
                  Community Focused
                </h3>
                <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.9' }}>
                  More than just coffee, we're a hub for local events and a place where friendships brew and ideas flourish.
                </p>
              </div>
            </div>
          </section>
        </FeaturesSection>

        {/* Menu Preview Section - Using the imported component directly */}
        <MenuPreviewSection />

        {/* Contact Section - Using the imported component directly */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;