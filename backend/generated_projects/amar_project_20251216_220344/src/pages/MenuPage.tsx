import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuContentSection from '../components/MenuContentSection';

const MenuPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, backgroundColor: '#f7fafc' }}>
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
        alignItems: 'center' as const
      }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          Savor the Flavor: Our Full Menu Awaits! 🍕
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}>
          Explore a delectable array of handcrafted pizzas, fresh salads, savory sides, and delightful desserts. Every dish is prepared with passion and the finest, freshest ingredients for an unforgettable dining experience.
        </p>
      </div>

      {/* Main Menu Content Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
        marginTop: '-100px', // Overlap with hero for a modern look
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
          Our Culinary Delights ✨
        </h2>
        {/* The MenuContentSection component is designed to display the actual menu items */}
        <MenuContentSection />
      </section>

      {/* Special Highlights Section */}
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
          Menu Highlights & Categories 🌟
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {/* Feature Card 1: Classic Pizzas */}
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
              <span style={{ fontSize: '2rem' }}>🍕</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Classic Pizzas
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              From the timeless Margherita to the hearty Pepperoni, our classic pizzas are crafted with authentic recipes and premium ingredients. A taste of tradition in every bite!
            </p>
          </div>

          {/* Feature Card 2: Gourmet Creations */}
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
              <span style={{ fontSize: '2rem' }}>✨</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Gourmet Creations
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Dare to try something new with our unique gourmet pizzas. Featuring exotic toppings and innovative flavor combinations, these are culinary masterpieces.
            </p>
          </div>

          {/* Feature Card 3: Fresh Salads & Sides */}
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
              <span style={{ fontSize: '2rem' }}>🥗</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Fresh Salads & Sides
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Complement your meal with our crisp, garden-fresh salads and a variety of delicious sides. Perfect for a lighter option or to share with friends.
            </p>
          </div>

          {/* Feature Card 4: Sweet Endings */}
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
              Sweet Endings
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Indulge your sweet tooth with our delightful selection of desserts. The perfect way to conclude your culinary journey with us.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
        color: 'white',
        marginTop: '60px'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          marginBottom: '30px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Ready to Order? 🚀
        </h2>
        <p style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '0 auto 40px auto', lineHeight: '1.8' }}>
          Browse our full menu above and click to add your favorites to your cart. Experience the best pizza in town, delivered fresh to your door!
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
          Order Now & Taste the Difference!
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;