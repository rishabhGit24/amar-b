import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuDisplay from '../components/MenuDisplay';

const MenuPage: React.FC = () => {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif", // A modern, clean font for the entire page
      color: '#2d3748',
      backgroundColor: '#f7fafc', // Light background for the whole page
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
    }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        padding: '100px 20px',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
        color: '#2d3748',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        boxShadow: 'inset 0 -5px 15px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const
        }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)', color: '#2d3748' }}>
            Savor Our Exquisite Menu
          </h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95, color: '#4a5568' }}>
            Discover a culinary journey crafted with passion, featuring fresh, locally-sourced ingredients and innovative flavors. Each dish tells a story.
          </p>
        </div>
      </section>

      {/* Main Menu Display Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        marginTop: '-50px', // Overlap with hero for a nice visual effect
        position: 'relative',
        zIndex: 1,
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Our Signature Dishes & Daily Delights ✨
        </h2>
        {/* The MenuDisplay component will render the detailed menu items */}
        <MenuDisplay />
      </section>

      {/* Why Choose Us / Features Section */}
      <section style={{
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '60px auto',
        background: '#f7fafc', // Slightly different background for contrast
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          The AMAR Dining Experience 🍽️
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {/* Feature Card 1: Fresh Ingredients */}
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
              Fresh, Local Ingredients
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              We partner with local farms and suppliers to bring you the freshest, seasonal produce and highest quality meats, ensuring every bite is a delight.
            </p>
          </div>

          {/* Feature Card 2: Masterful Craftsmanship */}
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
              Masterfully Crafted Dishes
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Our award-winning chefs pour their expertise and creativity into every plate, transforming simple ingredients into culinary masterpieces.
            </p>
          </div>

          {/* Feature Card 3: Perfect Ambiance */}
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
              <span style={{ fontSize: '2rem' }}>🍷</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Perfect Pairings & Ambiance
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Complement your meal with our curated selection of fine wines and beverages, all enjoyed in our elegant and inviting dining atmosphere.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '60px',
        borderRadius: '20px',
        maxWidth: '1200px',
        margin: '60px auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '30px',
          fontWeight: 'bold',
          textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
        }}>
          Ready to Indulge? 🥂
        </h2>
        <p style={{
          fontSize: '1.5rem',
          maxWidth: '800px',
          margin: '0 auto 40px auto',
          lineHeight: '1.8',
          opacity: 0.9
        }}>
          Explore our full menu and make a reservation to experience the AMAR difference. Your table awaits!
        </p>
        <button style={{
          background: 'white', // Inverted button for contrast
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
          letterSpacing: '1px',
          outline: 'none',
        }}>
          View Full Menu
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;