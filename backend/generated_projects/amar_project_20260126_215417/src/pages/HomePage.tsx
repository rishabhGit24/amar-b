import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import MenuSection from '../components/MenuSection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#333', backgroundColor: '#f8f8f8' }}>
      <Header />

      {/* Hero Section - Custom content based on template */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', // Soft, inviting gradient
        color: 'white',
        padding: '60px 20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '3px 3px 6px rgba(0,0,0,0.3)', letterSpacing: '-1px' }}>
            Your Daily Escape: Handcrafted Coffee & Delightful Bites ✨
          </h1>
          <p style={{ fontSize: '1.8rem', maxWidth: '800px', lineHeight: '1.6', opacity: 0.95, marginBottom: '40px' }}>
            Step into a world where every sip tells a story and every bite is a moment of pure joy. We're more than just a cafe; we're your cozy haven.
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
            Explore Our Menu
          </button>
        </div>
      </section>

      {/* About Section - Custom content based on template */}
      <section style={{
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '25px',
        boxShadow: '0 15px 45px rgba(0,0,0,0.08)',
        marginTop: '-80px', // Overlap with hero for visual interest
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          textAlign: 'center' as const,
          marginBottom: '20px',
          color: '#2d3748',
          fontWeight: 'bold',
          letterSpacing: '-0.5px'
        }}>
          Our Story: Passionately Brewing Since 2010 ☕
        </h2>
        <p style={{
          fontSize: '1.3rem',
          textAlign: 'center' as const,
          maxWidth: '800px',
          margin: '0 auto 60px auto',
          color: '#718096',
          lineHeight: '1.7'
        }}>
          From a humble dream to a bustling community hub, we've dedicated ourselves to crafting exceptional coffee and creating a warm, inviting atmosphere for everyone.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px'
        }}>
          {/* Feature Card 1 */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
              borderRadius: '18px',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2.5rem' }}>🌱</span>
            </div>
            <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '16px', fontWeight: '700' }}>
              Ethically Sourced Beans
            </h3>
            <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.8' }}>
              We partner with sustainable farms worldwide to bring you the finest, most aromatic coffee beans, ensuring fair trade and exceptional quality in every cup.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
              borderRadius: '18px',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2.5rem' }}>🥐</span>
            </div>
            <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '16px', fontWeight: '700' }}>
              Freshly Baked Delights
            </h3>
            <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.8' }}>
              Our pastry chefs bake a delectable array of croissants, cakes, and cookies daily, perfect for pairing with your favorite brew or as a sweet treat.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
              borderRadius: '18px',
              marginBottom: '25px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2.5rem' }}>🛋️</span>
            </div>
            <h3 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '16px', fontWeight: '700' }}>
              Cozy & Inviting Ambiance
            </h3>
            <p style={{ color: '#718096', fontSize: '1.15rem', lineHeight: '1.8' }}>
              Relax in our thoughtfully designed space, perfect for catching up with friends, diving into a good book, or simply enjoying a moment of peace.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section style={{
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold',
          letterSpacing: '-0.5px'
        }}>
          Our Delicious Offerings ☕🍰
        </h2>
        <MenuSection />
      </section>

      {/* Gallery Section */}
      <section style={{
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        background: '#f0f4f8',
        borderRadius: '25px',
        boxShadow: '0 15px 45px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold',
          letterSpacing: '-0.5px'
        }}>
          A Glimpse Inside Our Cafe 📸
        </h2>
        <GallerySection />
      </section>

      {/* Contact Section */}
      <section style={{
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold',
          letterSpacing: '-0.5px'
        }}>
          Visit Us Today! 📍
        </h2>
        <ContactSection />
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;