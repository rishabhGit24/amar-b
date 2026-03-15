import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import MenuSection from '../components/MenuSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', backgroundColor: '#f8f8f8' }}>
      <Header />

      {/* Hero Section */}
      <Hero>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center' as const,
          alignItems: 'center' as const,
          textAlign: 'center' as const,
          padding: '40px 20px'
        }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)', color: 'white' }}>
            Awaken Your Senses at The Daily Grind ✨
          </h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.95, color: 'white' }}>
            Experience the rich aroma of freshly roasted beans, handcrafted beverages, and a cozy atmosphere perfect for your daily escape. Your perfect cup awaits.
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
            Explore Our Menu ☕
          </button>
        </div>
      </Hero>

      {/* About Section */}
      <AboutSection>
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          marginTop: '-80px', // Overlap with Hero for visual interest
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
            Our Story: Passion in Every Cup 💡
          </h2>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.8',
            color: '#4a5568',
            textAlign: 'center' as const,
            maxWidth: '900px',
            margin: '0 auto 60px auto'
          }}>
            At The Daily Grind, we believe coffee is more than just a drink—it's an experience. From carefully selected beans sourced ethically from around the globe to the skilled hands of our baristas, every step is crafted with love and dedication to bring you the perfect cup.
          </p>
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
                <span style={{ fontSize: '2rem' }}>🌱</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Ethically Sourced Beans
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                We partner with farmers who share our commitment to sustainability and fair trade, ensuring every bean tells a story of quality and responsibility.
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
                <span style={{ fontSize: '2rem' }}>☕</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Artisan Roasting Process
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Our beans are roasted in small batches to perfection, unlocking their unique flavors and aromas for an unparalleled coffee experience.
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
                <span style={{ fontSize: '2rem' }}>🛋️</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Cozy & Inviting Atmosphere
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Relax in our warm and welcoming space, designed to be your perfect spot for work, catch-ups, or simply enjoying a moment of peace.
              </p>
            </div>
          </div>
        </section>
      </AboutSection>

      {/* Menu Section */}
      <MenuSection>
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#f8f8f8'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Sip, Savor, Enjoy: Our Exquisite Menu 🎯
          </h2>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.8',
            color: '#4a5568',
            textAlign: 'center' as const,
            maxWidth: '900px',
            margin: '0 auto 60px auto'
          }}>
            From classic espresso drinks to unique seasonal lattes, refreshing teas, and delectable pastries, our menu is crafted to delight every palate. Discover your new favorite today!
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
            {/* Menu Item Card 1 */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #e2e8f0',
              height: '100%'
            }}>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Signature Coffees ☕
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Espresso, Americano, Latte, Cappuccino, Macchiato. Handcrafted with our premium house blend.
              </p>
            </div>

            {/* Menu Item Card 2 */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #e2e8f0',
              height: '100%'
            }}>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Specialty Drinks ✨
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Caramel Macchiato, Vanilla Bean Latte, Seasonal Spiced Chai, Iced Matcha Latte.
              </p>
            </div>

            {/* Menu Item Card 3 */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              border: '1px solid #e2e8f0',
              height: '100%'
            }}>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Fresh Pastries & Bites 🥐
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Croissants, Muffins, Scones, Cookies, and a selection of light sandwiches. Baked fresh daily!
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center' as const, marginTop: '60px' }}>
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
              View Full Menu 📖
            </button>
          </div>
        </section>
      </MenuSection>

      {/* Contact Section */}
      <ContactSection>
        <section style={{
          padding: '80px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            Visit Us or Get in Touch 📍
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            textAlign: 'center' as const
          }}>
            <div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Our Location 🗺️
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                123 Coffee Lane, Brewton, CA 90210
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Opening Hours ⏰
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Mon - Fri: 7 AM - 6 PM <br />
                Sat - Sun: 8 AM - 5 PM
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                Contact Us 📞
              </h3>
              <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                Phone: (123) 456-7890 <br />
                Email: info@thedailygrind.com
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center' as const, marginTop: '60px' }}>
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
              Get Directions 🗺️
            </button>
          </div>
        </section>
      </ContactSection>

      <Footer />
    </div>
  );
};

export default HomePage;