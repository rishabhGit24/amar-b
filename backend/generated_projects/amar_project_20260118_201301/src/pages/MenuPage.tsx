import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuSection from '../components/MenuSection';

const MenuPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#2d3748', backgroundColor: '#f7fafc' }}>
      <Header />

      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: '120px 20px',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
        boxShadow: 'inset 0 -5px 15px rgba(0,0,0,0.05)',
        minHeight: '60vh'
      }}>
        <h1 style={{ fontSize: '4.8rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '3px 3px 6px rgba(0,0,0,0.15)', color: '#2d3748', letterSpacing: '-1px' }}>
          Our Exquisite Menu ✨
        </h1>
        <p style={{ fontSize: '1.7rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.9, color: '#4a5568' }}>
          Embark on a culinary journey with our thoughtfully curated dishes, crafted from the freshest seasonal ingredients. Every plate tells a story of passion and perfection.
        </p>
        <button style={{
          marginTop: '40px',
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
          View Today's Specials
        </button>
      </div>

      {/* Menu Highlights Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        marginBottom: '60px',
        marginTop: '-40px', // Overlap with hero for visual flow
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          Why Our Dishes Delight 🌟
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {/* Feature Card 1 */}
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
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>🌿</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Farm-Fresh Ingredients
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              We partner with local farms to source the freshest, highest-quality produce and meats, ensuring every bite is bursting with natural flavor.
            </p>
          </div>

          {/* Feature Card 2 */}
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
              background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
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
              Our chefs are true artists, meticulously preparing each dish with precision, creativity, and a deep understanding of culinary traditions.
            </p>
          </div>

          {/* Feature Card 3 */}
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
              background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>🌍</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Globally Inspired Flavors
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Explore a diverse palette of flavors, blending classic techniques with innovative twists from around the world to create unforgettable dishes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Menu Content Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#f7fafc', // Match page background for seamless integration
        marginBottom: '60px'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          Our Full Culinary Selection 📖
        </h2>
        {/* The MenuSection component is expected to render the detailed menu categories and items */}
        <MenuSection />
      </section>

      {/* Call to Action Section */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 -5px 15px rgba(0,0,0,0.1)',
        marginBottom: '0'
      }}>
        <h2 style={{
          fontSize: '3.8rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Ready to Indulge? 🥂
        </h2>
        <p style={{
          fontSize: '1.6rem',
          maxWidth: '800px',
          margin: '0 auto 40px auto',
          lineHeight: '1.8',
          opacity: 0.95
        }}>
          Experience the magic of our kitchen. Book your table now for an unforgettable dining experience or order online for a taste of luxury at home.
        </p>
        <button style={{
          background: 'white',
          color: '#667eea',
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
          Make a Reservation
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;