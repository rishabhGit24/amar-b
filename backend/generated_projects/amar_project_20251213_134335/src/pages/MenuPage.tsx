import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FullMenuDisplay from '../components/FullMenuDisplay';

const MenuPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f7fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' as const }}>
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
        alignItems: 'center' as const,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)', zIndex: 1 }}>
          Our Exquisite Menu ✨
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95, zIndex: 1 }}>
          Explore our handcrafted beverages, delectable pastries, and savory delights, all prepared with passion and the finest ingredients.
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', // A vibrant gradient for the button
          color: 'white',
          padding: '18px 48px',
          fontSize: '1.2rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(253, 160, 133, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px',
          marginTop: '40px',
          zIndex: 1
        }}>
          Order Online Now 🚀
        </button>
      </div>

      {/* Main Menu Display Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        marginTop: '-80px', // Overlap with hero for visual interest
        position: 'relative',
        zIndex: 2, // Ensure it's above the hero's background
        flexGrow: 1 // Allow this section to grow and push the footer down
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Discover Your Next Favorite ☕
        </h2>
        <FullMenuDisplay /> {/* Using FullMenuDisplay without props */}
      </section>

      {/* Highlights/Features Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '60px auto', // Added margin top/bottom for spacing
        background: '#f7fafc'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Why Our Menu Stands Out 🌟
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
              <span style={{ fontSize: '2rem' }}>🌱</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Locally Sourced Ingredients
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              We partner with local farms and suppliers to bring you the freshest, highest-quality ingredients in every dish and drink.
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
              Artisan Craftsmanship
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Every item on our menu is crafted with meticulous attention to detail by our skilled baristas and chefs.
            </p>
          </div>

          {/* Feature Card 3: Passion */}
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
              Passion in Every Sip & Bite
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              More than just food and drink, we offer an experience. Taste the passion in every item we serve.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;