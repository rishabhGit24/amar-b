import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuCategory from '../components/MenuCategory';

// Define interfaces for menu items and categories
// Assuming MenuCategory expects an array of objects for its 'items' prop,
// where each object represents a MenuItem.
interface MenuItemData {
  name: string;
  description: string;
  price: string;
}

interface MenuCategoryProps {
  title: string;
  items: MenuItemData[];
}

// Dummy menu data
const menuCategoriesData: MenuCategoryProps[] = [
  {
    title: "Appetizers 🍽️",
    items: [
      { name: "Crispy Calamari", description: "Lightly fried calamari served with a zesty lemon aioli.", price: "$14.00" },
      { name: "Caprese Skewers", description: "Fresh mozzarella, ripe cherry tomatoes, and basil drizzled with balsamic glaze.", price: "$12.50" },
      { name: "Truffle Fries", description: "Golden crispy fries tossed with truffle oil, parmesan, and fresh parsley.", price: "$10.00" },
      { name: "Spicy Edamame", description: "Steamed edamame pods seasoned with chili flakes and sea salt.", price: "$8.00" },
    ],
  },
  {
    title: "Main Courses 🍝",
    items: [
      { name: "Pan-Seared Salmon", description: "Atlantic salmon fillet with roasted asparagus and lemon-dill sauce.", price: "$28.00" },
      { name: "Ribeye Steak", description: "12oz prime ribeye, garlic mashed potatoes, and seasonal vegetables.", price: "$38.00" },
      { name: "Wild Mushroom Risotto", description: "Creamy Arborio rice with assorted wild mushrooms, parmesan, and truffle oil.", price: "$24.00" },
      { name: "Chicken Pesto Pasta", description: "Grilled chicken breast, fresh basil pesto, cherry tomatoes, and penne pasta.", price: "$22.00" },
      { name: "Vegan Buddha Bowl", description: "Quinoa, roasted sweet potatoes, avocado, chickpeas, and tahini dressing.", price: "$20.00" },
    ],
  },
  {
    title: "Desserts 🍰",
    items: [
      { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center, served with vanilla bean ice cream.", price: "$12.00" },
      { name: "New York Cheesecake", description: "Classic creamy cheesecake with a berry compote.", price: "$10.50" },
      { name: "Tiramisu", description: "Layers of coffee-soaked ladyfingers, mascarpone cheese, and cocoa powder.", price: "$11.00" },
    ],
  },
  {
    title: "Beverages 🍹",
    items: [
      { name: "Fresh Orange Juice", description: "Freshly squeezed daily.", price: "$6.00" },
      { name: "Sparkling Water", description: "Premium sparkling mineral water.", price: "$5.00" },
      { name: "Espresso", description: "Rich, concentrated coffee shot.", price: "$4.00" },
      { name: "House Red Wine", description: "A delightful glass of our selected house red.", price: "$10.00" },
    ],
  },
];

const MenuPage: React.FC = () => {
  return (
    <div>
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
          Savor the flavors: A culinary journey awaits. Explore our carefully crafted dishes, made with the freshest ingredients and passion.
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
          color: 'white',
          padding: '18px 48px',
          fontSize: '1.2rem',
          fontWeight: '600',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(246, 211, 101, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px',
          marginTop: '40px'
        }}>
          View Specials
        </button>
      </div>

      {/* Menu Categories Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#f8f9fa'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Explore Our Culinary Delights 👨‍🍳
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {menuCategoriesData.map((category, index) => (
            <MenuCategory
              key={index}
              title={category.title}
              items={category.items}
            />
          ))}
        </div>
      </section>

      {/* Chef's Recommendations / Special Features Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#ffffff'
      }}>
        <h2 style={{
          fontSize: '3rem',
          textAlign: 'center' as const,
          marginBottom: '60px',
          color: '#2d3748',
          fontWeight: 'bold'
        }}>
          Why Our Menu Stands Out 🌟
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
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
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
              We partner with local farms and suppliers to bring you the freshest, seasonal ingredients, ensuring quality and supporting our community.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>👨‍🍳</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Chef's Daily Specials
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              Our talented chefs craft unique daily specials, offering innovative dishes that highlight seasonal produce and culinary creativity.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            border: '1px solid #e2e8f0',
            height: '100%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
              borderRadius: '15px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center' as const,
              justifyContent: 'center' as const
            }}>
              <span style={{ fontSize: '2rem' }}>✨</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}>
              Dietary Accommodations
            </h3>
            <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}>
              We are happy to accommodate various dietary needs. Please inform your server of any allergies or preferences.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;