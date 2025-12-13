import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuCategory from '../components/MenuCategory';

// Assuming MenuItemProps is the interface for items expected by MenuCategory
interface MenuItemProps {
  name: string;
  description: string;
  price: string;
  // Add other properties if MenuCategory expects them, e.g., image: string;
}

// Dummy data for the menu categories and items
const menuData: { title: string; items: MenuItemProps[] }[] = [
  {
    title: 'Appetizers 🍽️',
    items: [
      { name: 'Crispy Calamari', description: 'Lightly fried calamari with a zesty lemon aioli.', price: '$12.99' },
      { name: 'Truffle Fries', description: 'Golden fries tossed with truffle oil, parmesan, and fresh parsley.', price: '$9.50' },
      { name: 'Caprese Skewers', description: 'Cherry tomatoes, fresh mozzarella, basil, drizzled with balsamic glaze.', price: '$10.00' },
      { name: 'Spinach Artichoke Dip', description: 'Creamy blend of spinach, artichokes, and cheese, served with warm pita.', price: '$11.50' },
    ],
  },
  {
    title: 'Main Courses 🍝',
    items: [
      { name: 'Seafood Linguine', description: 'Linguine pasta with shrimp, mussels, and scallops in a rich white wine sauce.', price: '$24.99' },
      { name: 'Grilled Ribeye Steak', description: '12oz prime ribeye, perfectly grilled, served with seasonal vegetables and mashed potatoes.', price: '$32.00' },
      { name: 'Vegetable Lasagna', description: 'Layers of fresh pasta, ricotta, spinach, and roasted seasonal vegetables, baked to perfection.', price: '$18.50' },
      { name: 'Chicken Parmesan', description: 'Breaded chicken breast topped with marinara and mozzarella, served with spaghetti.', price: '$21.00' },
      { name: 'Pan-Seared Salmon', description: 'Flaky salmon fillet with lemon-dill sauce, asparagus, and quinoa.', price: '$26.50' },
    ],
  },
  {
    title: 'Desserts 🍰',
    items: [
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream.', price: '$9.00' },
      { name: 'New York Cheesecake', description: 'Classic creamy cheesecake with a vibrant berry compote.', price: '$8.50' },
      { name: 'Artisan Gelato Selection', description: 'A rotating selection of handcrafted Italian gelatos, ask your server for today\'s flavors.', price: '$7.00' },
      { name: 'Key Lime Pie', description: 'Tangy and sweet key lime pie with a graham cracker crust.', price: '$8.00' },
    ],
  },
  {
    title: 'Beverages 🍹',
    items: [
      { name: 'Freshly Squeezed Orange Juice', description: 'Pure, natural orange juice, squeezed daily for ultimate freshness.', price: '$5.00' },
      { name: 'Sparkling Water', description: 'Premium sparkling mineral water, a refreshing choice.', price: '$4.00' },
      { name: 'Espresso', description: 'Rich, aromatic Italian espresso, perfect for a pick-me-up.', price: '$3.50' },
      { name: 'House Iced Tea', description: 'Freshly brewed black iced tea, unsweetened.', price: '$3.00' },
    ],
  },
];

const MenuPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, backgroundColor: '#f8f8f8' }}>
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
          Our Exquisite Menu ✨
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}>
          Discover a culinary journey with our carefully crafted dishes, made from the freshest ingredients.
          From delightful appetizers to decadent desserts, there's something to tantalize every palate.
        </p>
      </div>

      {/* Menu Categories Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
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
          Explore Our Culinary Delights 🚀
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr', // Stack categories vertically
          gap: '60px' // Space between categories
        }}>
          {menuData.map((category, index) => (
            <div key={index} style={{
              background: '#fdfdfd',
              padding: '40px',
              borderRadius: '15px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0'
            }}>
              <MenuCategory title={category.title} items={category.items} />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section (Optional, using button style) */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center' as const,
        background: '#f8f8f8'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: '#2d3748',
          marginBottom: '30px',
          fontWeight: 'bold'
        }}>
          Ready to Indulge? 😋
        </h2>
        <p style={{
          fontSize: '1.3rem',
          color: '#718096',
          maxWidth: '800px',
          margin: '0 auto 40px auto',
          lineHeight: '1.8'
        }}>
          Book a table or order online to experience our exceptional cuisine. We look forward to serving you!
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
          letterSpacing: '1px'
        }}>
          Make a Reservation
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;