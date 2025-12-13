import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturedDishesSection from '../components/FeaturedDishesSection';
import RestaurantHoursSection from '../components/RestaurantHoursSection';

const HomePage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif', margin: 0, padding: 0, boxSizing: 'border-box', backgroundColor: '#f7fafc' }}>
      <Header />

      <HeroSection>
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
            Savor the Extraordinary 🍽️
          </h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}>
            Experience culinary excellence with our exquisite dishes, crafted with passion and the freshest ingredients. Your journey to unforgettable flavors begins here.
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
            marginTop: '40px'
          }}>
            Explore Our Menu
          </button>
        </div>
      </HeroSection>

      <FeaturedDishesSection>
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Our Signature Creations ✨
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
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
                <span style={{ fontSize: '2rem' }}>🍝</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Handmade Pasta Perfection
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Indulge in our exquisite handmade pasta, crafted daily with fresh eggs and durum wheat. Each dish is a symphony of authentic Italian flavors.
              </p>
            </div>

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
                <span style={{ fontSize: '2rem' }}>🥩</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Prime Aged Steaks
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Savor the rich, tender taste of our prime aged steaks, expertly grilled to your preference and served with seasonal accompaniments.
              </p>
            </div>

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
                <span style={{ fontSize: '2rem' }}>🍰</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Decadent Desserts
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Conclude your meal with our array of handcrafted desserts, from classic tiramisu to innovative seasonal delights. A sweet ending to a perfect meal.
              </p>
            </div>
          </div>
        </section>
      </FeaturedDishesSection>

      <RestaurantHoursSection>
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#f7fafc',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          marginBottom: '40px',
          marginTop: '40px'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Our Opening Hours ⏰
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center' as const,
            gap: '20px',
            fontSize: '1.3rem',
            color: '#4a5568'
          }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#2d3748' }}>Monday - Friday:</strong> 11:00 AM - 10:00 PM
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#2d3748' }}>Saturday:</strong> 12:00 PM - 11:00 PM
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#2d3748' }}>Sunday:</strong> 12:00 PM - 9:00 PM
            </p>
            <p style={{ margin: 0, marginTop: '30px', fontSize: '1.1rem', fontStyle: 'italic', color: '#718096' }}>
              Reservations recommended for dinner service.
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
              marginTop: '40px'
            }}>
              Make a Reservation
            </button>
          </div>
        </section>
      </RestaurantHoursSection>

      <Footer />
    </div>
  );
};

export default HomePage;