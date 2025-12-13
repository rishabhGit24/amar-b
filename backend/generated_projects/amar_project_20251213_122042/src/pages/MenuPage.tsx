import React from 'react';
import Header from '../components/Header';
import MenuCategories from '../components/MenuCategories';
import MenuItem from '../components/MenuItem';
import Footer from '../components/Footer';

const MenuPage: React.FC = () => {
  const menuData = [
    {
      title: 'Appetizers',
      items: [
        { name: 'Crispy Calamari', description: 'Lightly fried calamari rings served with a zesty marinara sauce.', price: '$12.99' },
        { name: 'Garlic Parmesan Fries', description: 'Golden fries tossed with garlic, parmesan cheese, and fresh parsley.', price: '$8.50' },
        { name: 'Caprese Skewers', description: 'Cherry tomatoes, fresh mozzarella balls, and basil drizzled with balsamic glaze.', price: '$9.75' },
      ],
    },
    {
      title: 'Main Courses',
      items: [
        { name: 'Grilled Salmon', description: 'Perfectly grilled salmon fillet with lemon-dill sauce, served with roasted asparagus.', price: '$24.50' },
        { name: 'Ribeye Steak', description: 'Juicy 12oz ribeye steak, grilled to your preference, with a side of mashed potatoes.', price: '$32.00' },
        { name: 'Vegetable Risotto', description: 'Creamy Arborio rice with seasonal vegetables, finished with parmesan cheese.', price: '$19.00' },
        { name: 'Chicken Parmesan', description: 'Breaded chicken breast topped with marinara sauce and mozzarella, served with spaghetti.', price: '$21.75' },
      ],
    },
    {
      title: 'Desserts',
      items: [
        { name: 'Chocolate Lava Cake', description: 'Warm, decadent chocolate cake with a molten center, served with vanilla bean ice cream.', price: '$10.50' },
        { name: 'New York Cheesecake', description: 'Classic creamy cheesecake with a graham cracker crust, topped with berry compote.', price: '$9.00' },
        { name: 'Tiramisu', description: 'Espresso-soaked ladyfingers layered with mascarpone cream and cocoa powder.', price: '$9.50' },
      ],
    },
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6' }}>
      <Header />

      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          Explore Our Culinary Delights
        </h1>
        <p style={{ fontSize: '1.6rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}>
          Discover a symphony of flavors crafted with the freshest ingredients. From tantalizing appetizers to exquisite main courses and delightful desserts, our menu is designed to please every palate.
        </p>
      </div>

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
          textAlign: 'center',
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Our Signature Menu
        </h2>
        <MenuCategories categories={menuData.map(category => ({
          title: category.title,
          items: category.items.map(item => (
            <MenuItem key={item.name} name={item.name} description={item.description} price={item.price} />
          ))
        }))} />
      </section>

      <section style={{
        padding: '100px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Why Choose Us? ✨
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2rem' }}>⭐</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Fresh, Quality Ingredients
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              We pride ourselves on sourcing the finest, freshest ingredients to create dishes that are both delicious and wholesome.
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
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2rem' }}>💡</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Creative Culinary Artistry
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Our chefs blend traditional techniques with innovative flair to present unique and memorable dining experiences.
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
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2rem' }}>🚀</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Unforgettable Ambiance
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Enjoy your meal in a warm, inviting atmosphere perfect for any occasion, from casual dinners to special celebrations.
            </p>
          </div>
        </div>
      </section>

      <div style={{
        padding: '100px 20px',
        textAlign: 'center',
        background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '30px' }}>
          Ready to Savor the Experience?
        </h2>
        <p style={{ fontSize: '1.3rem', marginBottom: '40px', opacity: 0.9 }}>
          Visit us today or make a reservation to embark on a culinary journey you won't forget.
        </p>
        <button style={{
          background: 'white',
          color: '#4facfe',
          padding: '18px 48px',
          fontSize: '1.2rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Book Your Table
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;