import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutContent from '../components/AboutContent';

const AboutPage: React.FC = () => {
  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      color: '#2d3748',
      backgroundColor: '#f7fafc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
    }}>
      <Header />
      <main style={{ flexGrow: 1 }}>
        <AboutContent>
          {/* Hero Section */}
          <section style={{
            padding: '120px 20px',
            textAlign: 'center' as const,
            background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
            color: '#2d3748',
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            minHeight: '60vh',
            boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column' as const,
              justifyContent: 'center' as const,
              alignItems: 'center' as const
            }}>
              <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)', color: '#2d3748' }}>
                Our Story, Our Passion, Your Pizza 🍕
              </h1>
              <p style={{ fontSize: '1.5rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.95, marginBottom: '40px' }}>
                Discover the heart behind every slice at our pizzeria. From humble beginnings to a beloved community staple, we're dedicated to crafting exceptional pizzas with love, tradition, and the finest ingredients.
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
                outline: 'none'
              }}>
                Explore Our Journey
              </button>
            </div>
          </section>

          {/* Our Journey: A Taste of Tradition Section */}
          <section style={{
            padding: '80px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.05)',
            marginTop: '-60px', // Overlap with hero for visual interest
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
              Our Journey: A Taste of Tradition ✨
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px'
            }}>
              {/* Content cards */}
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
                  <span style={{ fontSize: '2rem' }}>🏡</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                  Humble Beginnings
                </h3>
                <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  Born from a cherished family recipe passed down through generations, our pizzeria started with a simple dream: to share authentic, delicious pizza with our neighborhood. Every dough, every sauce, tells a story of passion and heritage.
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
                  <span style={{ fontSize: '2rem' }}>👨‍🍳</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                  Crafted with Care
                </h3>
                <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  We believe in the art of pizza making. From hand-kneading our dough daily to sourcing the freshest local produce and premium cheeses, quality is at the heart of everything we do. Each ingredient is chosen for its flavor and integrity.
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
                  <span style={{ fontSize: '2rem' }}>❤️</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                  Community & Connection
                </h3>
                <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  More than just a restaurant, we're a gathering place. We cherish the laughter, conversations, and memories made around our tables, fostering a warm and welcoming atmosphere where everyone feels like family.
                </p>
              </div>
            </div>
          </section>

          {/* Our Mission & Core Values Section */}
          <section style={{
            padding: '80px 20px',
            maxWidth: '1200px',
            margin: '80px auto',
            background: '#f7fafc',
            borderRadius: '20px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '3rem',
              textAlign: 'center' as const,
              marginBottom: '60px',
              color: '#2d3748',
              fontWeight: 'bold'
            }}>
              Our Mission & Core Values 🌟
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px'
            }}>
              {/* Content cards */}
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
                  <span style={{ fontSize: '2rem' }}>🎯</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                  Excellence in Every Bite
                </h3>
                <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  To consistently deliver an unparalleled culinary experience, ensuring every pizza is a masterpiece of flavor, texture, and freshness. We strive for perfection in every detail, from crust to topping.
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
                  <span style={{ fontSize: '2rem' }}>🌱</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                  Sustainable Sourcing
                </h3>
                <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  Committed to supporting local farmers and ethical suppliers, we prioritize fresh, seasonal ingredients that are good for you and good for the planet. Our choices reflect our respect for nature and community.
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
                  <span style={{ fontSize: '2rem' }}>😊</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
                  Joyful Service
                </h3>
                <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
                  To create a friendly, inviting environment where every guest feels valued and leaves with a smile, eager to return for more than just great food. Our team is dedicated to making your visit memorable.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section style={{
            padding: '80px 20px',
            textAlign: 'center' as const,
            background: 'linear-gradient(135deg, #e2e8f0 0%, #f0f4f8 100%)',
            color: '#2d3748',
            marginBottom: '0',
            boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '30px', color: '#2d3748' }}>
              Ready to Taste the Difference?
            </h2>
            <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95, margin: '0 auto 40px auto' }}>
              Join us and experience the passion, tradition, and quality that goes into every single pizza we make. We can't wait to welcome you!
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
              outline: 'none'
            }}>
              View Our Menu
            </button>
          </section>
        </AboutContent>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;