import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuSection from '../components/MenuSection';

const MenuPage: React.FC = () => {
  return (
    <>
      <Header />
      <main style={{
        fontFamily: "'Inter', sans-serif",
        color: '#333',
        backgroundColor: '#f8f8f8',
        lineHeight: 1.6,
        paddingBottom: '80px'
      }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e7ed 100%)',
          padding: '100px 20px',
          textAlign: 'center' as const,
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          minHeight: '400px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center' as const,
            alignItems: 'center' as const
          }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.15)', color: '#2c3e50' }}>
              Sip, Savor, & Delight ✨
            </h1>
            <p style={{ fontSize: '1.5rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.9, color: '#555' }}>
              Explore our exquisite selection of handcrafted coffees, artisanal pastries, and refreshing beverages, all prepared with passion and the finest ingredients. Your perfect moment awaits.
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
              View Our Full Menu
            </button>
          </div>
        </section>

        {/* Coffee Classics Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          marginTop: '-60px',
          position: 'relative',
          zIndex: 10
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Our Signature Coffee Creations ☕
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
            <MenuSection />
            <MenuSection />
            <MenuSection />
          </div>
        </section>

        {/* Artisanal Pastries Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '80px auto',
          background: '#fefefe',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Freshly Baked Delights 🥐
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
            <MenuSection />
            <MenuSection />
            <MenuSection />
          </div>
        </section>

        {/* Refreshing Teas & More Section */}
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '80px auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Beyond Coffee: A World of Refreshment 🍵
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
            <MenuSection />
            <MenuSection />
            <MenuSection />
          </div>
        </section>

        {/* Call to Action Section */}
        <section style={{
          padding: '100px 20px',
          textAlign: 'center' as const,
          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          color: 'white',
          marginTop: '80px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '30px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
            Ready to Indulge? 🚀
          </h2>
          <p style={{ fontSize: '1.6rem', maxWidth: '900px', margin: '0 auto 50px auto', lineHeight: '1.8', opacity: 0.95 }}>
            Whether you're craving a rich espresso, a flaky croissant, or a soothing herbal tea, our menu has something special for everyone. Visit us today or order online for a taste of perfection.
          </p>
          <button style={{
            background: 'white',
            color: '#764ba2',
            padding: '20px 50px',
            fontSize: '1.3rem',
            fontWeight: '700',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase' as const,
            letterSpacing: '1px'
          }}>
            Find Our Location
          </button>
        </section>

      </main>
      <Footer />
    </>
  );
};

export default MenuPage;