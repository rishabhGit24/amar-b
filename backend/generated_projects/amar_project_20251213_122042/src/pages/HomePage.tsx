import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturedDishes from '../components/FeaturedDishes';
import RestaurantHours from '../components/RestaurantHours';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6' }}>
      <Header />

      <HeroSection
        title="Savor the Flavors of Excellence"
        description="Experience a culinary journey like no other. Our passion for fresh ingredients and exquisite tastes brings you dishes that delight and inspire."
        buttonText="Explore Our Menu"
        buttonLink="/menu"
        backgroundImage="https://images.unsplash.com/photo-1551029506-080859a89971?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      />

      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        marginTop: '-100px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Discover Our Signature Dishes 🌟
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          <FeaturedDishes />
        </div>
      </section>

      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center' as const,
        color: '#4a5568'
      }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          When to Visit Us ⏰
        </h2>
        <RestaurantHours />
      </section>

      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const
      }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          Ready for an Unforgettable Meal?
        </h2>
        <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95, marginBottom: '40px' }}>
          Join us for an exceptional dining experience. Book your table today and let us treat you to the finest cuisine.
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
          boxShadow: '0 10px 30px rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px'
        }}>
          Book a Table
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;