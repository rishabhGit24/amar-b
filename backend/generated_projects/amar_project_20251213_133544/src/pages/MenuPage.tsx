import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuCategory from '../components/MenuCategory';

// Define the interface for a menu item, assuming MenuCategory expects this structure for its 'items' prop.
interface MenuItemData {
  name: string;
  description: string;
  price: string; // Using string for price to handle currency formatting easily
}

const MenuPage: React.FC = () => {
  // Sample data for menu categories
  const appetizers: MenuItemData[] = [
    {
      name: 'Crispy Calamari',
      description: 'Lightly fried calamari served with a zesty lemon aioli and fresh parsley.',
      price: '$12.99',
    },
    {
      name: 'Caprese Skewers',
      description: 'Fresh mozzarella, ripe cherry tomatoes, and fragrant basil drizzled with balsamic glaze.',
      price: '$9.50',
    },
    {
      name: 'Garlic Parmesan Knots',
      description: 'Warm, soft dough knots brushed with rich garlic butter and grated parmesan, served with marinara.',
      price: '$7.99',
    },
    {
      name: 'Spicy Edamame',
      description: 'Steamed edamame pods tossed in a savory and spicy garlic chili sauce, a perfect starter.',
      price: '$6.00',
    },
  ];

  const mainCourses: MenuItemData[] = [
    {
      name: 'Grilled Salmon with Asparagus',
      description: 'Perfectly grilled Atlantic salmon fillet served with tender roasted asparagus and a delicate lemon-dill sauce.',
      price: '$24.99',
    },
    {
      name: 'Truffle Mushroom Risotto',
      description: 'Creamy Arborio rice cooked to perfection with wild mushrooms and aromatic truffle oil, topped with fresh parmesan.',
      price: '$19.99',
    },
    {
      name: 'Spicy Arrabiata Pasta',
      description: 'Al dente penne pasta tossed in a fiery tomato sauce with garlic, red chili flakes, and fresh basil.',
      price: '$17.50',
    },
    {
      name: 'Classic Margherita Pizza',
      description: 'Our signature pizza with San Marzano tomato sauce, fresh mozzarella, basil leaves, and a drizzle of olive oil.',
      price: '$16.00',
    },
    {
      name: 'Pan-Seared Duck Breast',
      description: 'Crispy-skinned duck breast served with a cherry reduction and creamy potato gratin.',
      price: '$28.00',
    },
  ];

  const desserts: MenuItemData[] = [
    {
      name: 'Classic Tiramisu',
      description: 'Layers of coffee-soaked ladyfingers, rich mascarpone cheese, and a dusting of cocoa powder.',
      price: '$8.99',
    },
    {
      name: 'Chocolate Lava Cake',
      description: 'Warm, rich chocolate cake with a molten chocolate center, served with a scoop of vanilla bean ice cream.',
      price: '$9.50',
    },
    {
      name: 'New York Cheesecake',
      description: 'Creamy, dense cheesecake on a buttery graham cracker crust, topped with a vibrant mixed berry compote.',
      price: '$7.99',
    },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#333' }}>
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
          Savor Our Exquisite Menu ✨
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}>
          Discover a culinary journey with our carefully crafted dishes, from delightful appetizers to decadent desserts. Each plate is a masterpiece, prepared with the freshest ingredients and passion.
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
          color: 'white',
          padding: '18px 48px',
          fontSize: '1.2rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(255, 126, 95, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px',
          marginTop: '40px',
          outline: 'none'
        }}>
          View Today's Specials 🚀
        </button>
      </div>

      {/* Menu Categories Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        marginTop: '-100px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          textAlign: 'center' as const,
          marginBottom: '80px',
          color: '#2d3748',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
        }}>
          Our Delicious Offerings 🍽️
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '60px'
        }}>
          <MenuCategory title="Appetizers 🍤" items={appetizers} />
          <MenuCategory title="Main Courses 🍝" items={mainCourses} />
          <MenuCategory title="Decadent Desserts 🍰" items={desserts} />
        </div>
      </section>

      {/* Call to Action / Additional Info Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '80px auto',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '2.8rem',
          color: '#2d3748',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Ready to Indulge? 😋
        </h2>
        <p style={{
          fontSize: '1.3rem',
          color: '#4a5568',
          maxWidth: '800px',
          margin: '0 auto 40px auto',
          lineHeight: '1.7'
        }}>
          Explore our full menu and make a reservation for an unforgettable dining experience. We look forward to serving you with passion and excellence!
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
          Book a Table Now 🗓️
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;