import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturedDishes from '../components/FeaturedDishes';
import RestaurantHours from '../components/RestaurantHours';

const HomePage: React.FC = () => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <Header />

      <main>
        {/* Hero Section - Using the HeroSection component as instructed */}
        {/* The HeroSection component is expected to render its own content and apply the specified hero styling internally. */}
        {/* As per instructions, using it without props as no specific props were defined. */}
        <HeroSection />

        {/* Featured Dishes Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          marginTop: '40px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Our Culinary Masterpieces ✨
          </h2>
          <FeaturedDishes />
        </section>

        {/* Why Choose Us / Benefits Section - Using general content section and feature card styles */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#f7fafc'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Why Dine With Us? 🌟
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
                Award-Winning Chefs
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Our kitchen is led by a team of culinary artists dedicated to crafting unforgettable dishes using the finest ingredients.
              </p>
            </div>

            {/* Feature Card 2 */}
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
                Locally Sourced Ingredients
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                We partner with local farms and suppliers to bring you the freshest, seasonal produce and ethically raised meats.
              </p>
            </div>

            {/* Feature Card 3 */}
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
                <span style={{ fontSize: '2rem' }}>🥂</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Exquisite Dining Experience
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                From the elegant ambiance to impeccable service, every detail is curated for your ultimate enjoyment.
              </p>
            </div>
          </div>
        </section>

        {/* Restaurant Hours Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          marginTop: '40px',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Our Operating Hours ⏰
          </h2>
          <RestaurantHours />
        </section>

        {/* Call to Action Section */}
        <section style={{
          padding: '100px 20px',
          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          color: 'white',
          textAlign: 'center' as const,
          marginBottom: '0'
        }}>
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '24px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            Ready for an Unforgettable Meal?
          </h2>
          <p style={{
            fontSize: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto 40px auto',
            lineHeight: '1.8',
            opacity: 0.95
          }}>
            Book your table now and embark on a culinary journey that will delight your senses. We look forward to welcoming you!
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
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase' as const,
            letterSpacing: '1px'
          }}>
            Reserve Your Table Today! 🍽️
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;