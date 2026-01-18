import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import MenuHighlights from '../components/MenuHighlights';
import AboutSnippet from '../components/AboutSnippet';

const HomePage: React.FC = () => {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      color: '#333',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header />
      <main style={{ flexGrow: 1 }}>

        {/* Hero Section */}
        <HeroSection>
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            textAlign: 'center' as const,
            padding: '100px 20px',
            background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e7ef 100%)',
            borderRadius: '0 0 50px 50px',
            boxShadow: '0 15px 45px rgba(0,0,0,0.08)',
            marginBottom: '80px'
          }}>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '28px', textShadow: '3px 3px 6px rgba(0,0,0,0.15)', color: '#2d3748' }}>
              Your Daily Dose of Delight ☕
            </h1>
            <p style={{ fontSize: '1.6rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.9, color: '#4a5568', marginBottom: '40px' }}>
              Step into a world where every sip tells a story. Discover artisanal coffee, freshly baked pastries, and a cozy ambiance perfect for any moment.
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
              letterSpacing: '1px',
              marginTop: '20px'
            }}>
              Explore Our Menu ✨
            </button>
          </div>
        </HeroSection>

        {/* Menu Highlights Section */}
        <MenuHighlights>
          <section style={{
            padding: '80px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '25px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            marginBottom: '80px'
          }}>
            <h2 style={{
              fontSize: '3.5rem',
              textAlign: 'center' as const,
              marginBottom: '60px',
              color: '#2d3748',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
            }}>
              Our Signature Delights 🌟
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px'
            }}>
              {/* Menu Highlight Card 1 */}
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                  borderRadius: '50%',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  boxShadow: '0 8px 20px rgba(253, 160, 133, 0.4)'
                }}>
                  <span style={{ fontSize: '3rem' }}>☕</span>
                </div>
                <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '16px', fontWeight: '700', textAlign: 'center' }}>
                  Artisan Espresso
                </h3>
                <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.8', textAlign: 'center' }}>
                  Crafted with passion, our espresso features rich, aromatic beans sourced from sustainable farms. A perfect start to your day.
                </p>
              </div>

              {/* Menu Highlight Card 2 */}
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                  borderRadius: '50%',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  boxShadow: '0 8px 20px rgba(161, 196, 253, 0.4)'
                }}>
                  <span style={{ fontSize: '3rem' }}>🥐</span>
                </div>
                <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '16px', fontWeight: '700', textAlign: 'center' }}>
                  Flaky Croissants
                </h3>
                <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.8', textAlign: 'center' }}>
                  Baked fresh daily, our butter croissants are golden, flaky, and melt-in-your-mouth delicious. Pair it with your favorite coffee!
                </p>
              </div>

              {/* Menu Highlight Card 3 */}
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                  borderRadius: '50%',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center' as const,
                  justifyContent: 'center' as const,
                  boxShadow: '0 8px 20px rgba(132, 250, 176, 0.4)'
                }}>
                  <span style={{ fontSize: '3rem' }}>🍰</span>
                </div>
                <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '16px', fontWeight: '700', textAlign: 'center' }}>
                  Decadent Cakes
                </h3>
                <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.8', textAlign: 'center' }}>
                  Indulge in our selection of exquisite cakes, perfect for celebrating life's sweet moments or simply treating yourself.
                </p>
              </div>
            </div>
          </section>
        </MenuHighlights>

        {/* About Snippet Section */}
        <AboutSnippet>
          <section style={{
            padding: '80px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #e0f2f7 0%, #d1e9f0 100%)',
            borderRadius: '25px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            marginBottom: '80px',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '3.5rem',
              textAlign: 'center' as const,
              marginBottom: '40px',
              color: '#2d3748',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
            }}>
              Our Story & Mission 💖
            </h2>
            <p style={{ color: '#4a5568', fontSize: '1.3rem', lineHeight: '1.9', maxWidth: '900px', margin: '0 auto 50px auto' }}>
              At AMAR Coffee Co., we believe in creating more than just coffee; we craft experiences. Our journey began with a simple dream: to build a community hub where quality meets comfort. We are committed to sourcing the finest beans, supporting local artisans, and providing a welcoming space for everyone.
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
              letterSpacing: '1px',
            }}>
              Learn More About Us 💡
            </button>
          </section>
        </AboutSnippet>

      </main>
      <Footer />
    </div>
  );
};

export default HomePage;