import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import MenuPreviewSection from '../components/MenuPreviewSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#333', backgroundColor: '#f8f8f8' }}>
      <Header />

      {/* Hero Section */}
      <HeroSection>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          textAlign: 'center' as const,
          padding: '60px 20px',
          minHeight: '60vh',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(240,240,240,0.8) 100%)',
          borderRadius: '25px',
          margin: '40px auto',
          maxWidth: '1400px',
          boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '28px', textShadow: '3px 3px 6px rgba(0,0,0,0.25)', color: '#4a2c00', lineHeight: '1.1' }}>
            Brew Haven: Your Daily Escape ☕
          </h1>
          <p style={{ fontSize: '1.6rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.9, color: '#5a4a3a', marginBottom: '40px' }}>
            Step into Brew Haven, where every cup tells a story. Indulge in artisanal coffee, delightful pastries, and a cozy ambiance designed for your perfect moment of peace. Start your day, fuel your afternoon, or unwind with us.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', /* Coffee-like gradient */
            color: 'white',
            padding: '20px 55px',
            fontSize: '1.3rem',
            fontWeight: '700',
            border: 'none',
            borderRadius: '60px',
            cursor: 'pointer',
            boxShadow: '0 12px 35px rgba(139, 69, 19, 0.5)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase' as const,
            letterSpacing: '1.5px',
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
          maxWidth: '1300px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '25px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '3.8rem',
            textAlign: 'center' as const,
            marginBottom: '70px',
            color: '#4a2c00',
            fontWeight: 'bold',
            textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
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
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #f0e0d0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'flex-start' as const
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #A0522D 0%, #D2691E 100%)', /* Warm gradient */
                borderRadius: '20px',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
                boxShadow: '0 8px 20px rgba(160, 82, 45, 0.4)'
              }}>
                <span style={{ fontSize: '2.5rem' }}>☕</span>
              </div>
              <h3 style={{ fontSize: '2rem', color: '#4a2c00', marginBottom: '18px', fontWeight: '700' }}>
                Artisanal Coffee Blends
              </h3>
              <p style={{ color: '#7a6a5a', fontSize: '1.2rem', lineHeight: '1.9' }}>
                Savor our meticulously sourced beans, expertly roasted and brewed to perfection. From rich espressos to creamy lattes, discover your new favorite crafted with passion.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div style={{
              background: 'white',
              padding: '45px',
              borderRadius: '25px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #f0e0d0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'flex-start' as const
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #D2691E 0%, #FF7F50 100%)', /* Warm gradient */
                borderRadius: '20px',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
                boxShadow: '0 8px 20px rgba(210, 105, 30, 0.4)'
              }}>
                <span style={{ fontSize: '2.5rem' }}>🥐</span>
              </div>
              <h3 style={{ fontSize: '2rem', color: '#4a2c00', marginBottom: '18px', fontWeight: '700' }}>
                Freshly Baked Delights
              </h3>
              <p style={{ color: '#7a6a5a', fontSize: '1.2rem', lineHeight: '1.9' }}>
                Pair your coffee with our irresistible selection of pastries, cakes, and sandwiches, baked fresh daily with the finest, locally sourced ingredients. Pure bliss in every bite!
              </p>
            </div>

            {/* Feature Card 3 */}
            <div style={{
              background: 'white',
              padding: '45px',
              borderRadius: '25px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #f0e0d0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'flex-start' as const
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #FF7F50 0%, #FFD700 100%)', /* Warm gradient */
                borderRadius: '20px',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
                boxShadow: '0 8px 20px rgba(255, 127, 80, 0.4)'
              }}>
                <span style={{ fontSize: '2.5rem' }}>🛋️</span>
              </div>
              <h3 style={{ fontSize: '2rem', color: '#4a2c00', marginBottom: '18px', fontWeight: '700' }}>
                Cozy & Inviting Atmosphere
              </h3>
              <p style={{ color: '#7a6a5a', fontSize: '1.2rem', lineHeight: '1.9' }}>
                Relax in our warm, welcoming space. Whether you're working, meeting friends, or enjoying a quiet moment, Brew Haven is your perfect retreat from the everyday hustle.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div style={{
              background: 'white',
              padding: '45px',
              borderRadius: '25px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #f0e0d0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'flex-start' as const
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)', /* Warm gradient */
                borderRadius: '20px',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center' as const,
                justifyContent: 'center' as const,
                boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)'
              }}>
                <span style={{ fontSize: '2.5rem' }}>⭐</span>
              </div>
              <h3 style={{ fontSize: '2rem', color: '#4a2c00', marginBottom: '18px', fontWeight: '700' }}>
                Exceptional Service
              </h3>
              <p style={{ color: '#7a6a5a', fontSize: '1.2rem', lineHeight: '1.9' }}>
                Our friendly baristas are passionate about coffee and dedicated to making your visit a delightful and memorable experience every time. We're here to brighten your day!
              </p>
            </div>
          </div>
        </section>
      </FeaturesSection>

      {/* Menu Preview Section */}
      <MenuPreviewSection />

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </div>
  );
};

export default HomePage;