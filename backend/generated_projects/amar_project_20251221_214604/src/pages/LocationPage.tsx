import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LocationInfo from '../components/LocationInfo';

const LocationPage: React.FC = () => {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      color: '#2d3748',
      lineHeight: 1.6,
      backgroundColor: '#f7fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '120px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const
        }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
            Discover Our Prime Location ✨
          </h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}>
            Your gateway to exceptional service and convenience. Find us easily and experience the difference.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
            color: '#667eea',
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
            Get Directions Now
          </button>
        </div>
      </section>

      {/* Location Details Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        marginTop: '-60px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Your Destination for Excellence 📍
        </h2>
        <LocationInfo />
      </section>

      {/* Why Visit Us Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '80px auto',
        background: '#f7fafc',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Experience the Convenience 🚀
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {/* Feature Card 1: Ample Parking */}
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
              <span style={{ fontSize: '2rem' }}>🚗</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Ample Parking Available
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Enjoy stress-free visits with our spacious and easily accessible parking facilities right on-site.
            </p>
          </div>

          {/* Feature Card 2: Public Transport Friendly */}
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
              <span style={{ fontSize: '2rem' }}>🚇</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Public Transport Friendly
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Conveniently located near major bus and train routes, making your journey effortless.
            </p>
          </div>

          {/* Feature Card 3: Vibrant Neighborhood */}
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
              <span style={{ fontSize: '2rem' }}>🌳</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Vibrant Neighborhood
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Explore local cafes, shops, and parks in our lively and welcoming community, just steps away.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
        marginTop: '80px'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Ready to Visit Us? 🗺️
        </h2>
        <p style={{ fontSize: '1.5rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.95, marginBottom: '40px' }}>
          We look forward to welcoming you. Plan your trip and discover everything our location has to offer.
        </p>
        <button style={{
          background: 'white',
          color: '#764ba2',
          padding: '18px 48px',
          fontSize: '1.2rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(255,255,255,0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px'
        }}>
          View Detailed Directions
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default LocationPage;