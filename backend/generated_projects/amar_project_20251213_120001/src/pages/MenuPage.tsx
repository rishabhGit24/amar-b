import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuSection from '../components/MenuSection';

// Define types for menu items and categories
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

interface MenuCategory {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
}

// Mock Menu Data
const menuCategories: MenuCategory[] = [
  {
    id: 'appetizers',
    title: 'Tantalizing Appetizers',
    description: 'Start your culinary journey with our exquisite selection of small plates, perfect for sharing or savoring solo.',
    items: [
      {
        id: 'app1',
        name: 'Crispy Calamari',
        description: 'Lightly fried calamari rings served with a zesty lemon aioli and fresh parsley.',
        price: '$14.00',
        image: 'https://example.com/calamari.jpg', // Placeholder image URL
      },
      {
        id: 'app2',
        name: 'Caprese Skewers',
        description: 'Fresh mozzarella, cherry tomatoes, and basil drizzled with balsamic glaze.',
        price: '$12.00',
        image: 'https://example.com/caprese.jpg',
        isVegetarian: true,
      },
      {
        id: 'app3',
        name: 'Spicy Edamame',
        description: 'Steamed edamame pods tossed in a fiery garlic chili sauce.',
        price: '$9.00',
        image: 'https://example.com/edamame.jpg',
        isVegetarian: true,
        isSpicy: true,
      },
    ],
  },
  {
    id: 'main-courses',
    title: 'Signature Main Courses',
    description: 'Experience the heart of our kitchen with dishes crafted from the finest ingredients, designed to delight every palate.',
    items: [
      {
        id: 'main1',
        name: 'Pan-Seared Salmon',
        description: 'Flaky Atlantic salmon served with roasted asparagus and a creamy dill sauce.',
        price: '$28.00',
        image: 'https://example.com/salmon.jpg',
      },
      {
        id: 'main2',
        name: 'Truffle Mushroom Risotto',
        description: 'Arborio rice cooked to perfection with wild mushrooms, Parmesan, and a hint of black truffle oil.',
        price: '$26.00',
        image: 'https://example.com/risotto.jpg',
        isVegetarian: true,
      },
      {
        id: 'main3',
        name: 'Grilled Ribeye Steak',
        description: '12oz prime ribeye, grilled to your preference, served with garlic mashed potatoes and seasonal vegetables.',
        price: '$38.00',
        image: 'https://example.com/ribeye.jpg',
      },
      {
        id: 'main4',
        name: 'Spicy Arrabiata Pasta',
        description: 'Penne pasta in a rich, spicy tomato sauce with fresh basil and a sprinkle of Pecorino Romano.',
        price: '$22.00',
        image: 'https://example.com/arrabiata.jpg',
        isVegetarian: true,
        isSpicy: true,
      },
    ],
  },
  {
    id: 'desserts',
    title: 'Decadent Desserts',
    description: 'Conclude your meal with a sweet symphony. Our desserts are the perfect ending to any dining experience.',
    items: [
      {
        id: 'dessert1',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream.',
        price: '$11.00',
        image: 'https://example.com/lava-cake.jpg',
      },
      {
        id: 'dessert2',
        name: 'New York Cheesecake',
        description: 'Classic creamy cheesecake with a graham cracker crust, topped with fresh berries.',
        price: '$10.00',
        image: 'https://example.com/cheesecake.jpg',
      },
      {
        id: 'dessert3',
        name: 'Tiramisu',
        description: 'Layers of coffee-soaked ladyfingers, mascarpone cheese, and cocoa powder.',
        price: '$10.50',
        image: 'https://example.com/tiramisu.jpg',
      },
    ],
  },
  {
    id: 'beverages',
    title: 'Refreshing Beverages',
    description: 'Quench your thirst with our selection of handcrafted drinks, from fresh juices to artisanal coffees.',
    items: [
      {
        id: 'bev1',
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed oranges, a burst of natural sweetness.',
        price: '$6.00',
        image: 'https://example.com/orange-juice.jpg',
      },
      {
        id: 'bev2',
        name: 'Artisanal Cold Brew',
        description: 'Slow-steeped coffee concentrate, smooth and rich.',
        price: '$7.00',
        image: 'https://example.com/cold-brew.jpg',
      },
      {
        id: 'bev3',
        name: 'Sparkling Elderflower Spritzer',
        description: 'Elderflower syrup, sparkling water, and a hint of lime.',
        price: '$7.50',
        image: 'https://example.com/spritzer.jpg',
      },
    ],
  },
];

const MenuPage: React.FC = () => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f8f9fa', color: '#333' }}>
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
          Our Exquisite Culinary Journey ✨
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '800px', lineHeight: '1.8', opacity: 0.95 }}>
          Explore a world of flavors crafted with passion and the freshest ingredients. From tantalizing appetizers to decadent desserts, every dish tells a story of culinary excellence.
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
          color: '#333',
          padding: '18px 48px',
          fontSize: '1.2rem',
          fontWeight: '700',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(246, 211, 101, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase' as const,
          letterSpacing: '1px',
          marginTop: '40px'
        }}>
          Reserve a Table Today 🍽️
        </button>
      </div>

      {/* Menu Sections */}
      {menuCategories.map((category) => (
        <section
          key={category.id}
          style={{
            padding: '80px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            marginBottom: '40px',
            marginTop: '40px'
          }}
        >
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold'
          }}>
            {category.title} 🚀
          </h2>
          <p style={{
            fontSize: '1.2rem',
            textAlign: 'center' as const,
            maxWidth: '800px',
            margin: '0 auto 60px auto',
            color: '#718096',
            lineHeight: '1.8'
          }}>
            {category.description}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
            {category.items.map((item) => (
              <MenuSection
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                isVegetarian={item.isVegetarian}
                isSpicy={item.isSpicy}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Call to Action Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        marginBottom: '40px',
        marginTop: '40px'
      }}>
        <h2 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          color: '#2d3748'
        }}>
          Ready to Indulge? 💡
        </h2>
        <p style={{
          fontSize: '1.5rem',
          maxWidth: '700px',
          margin: '0 auto 40px auto',
          lineHeight: '1.8',
          color: '#718096'
        }}>
          Our chefs are ready to prepare an unforgettable meal for you. Book your table or order online for a delightful experience.
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
          Order Online Now ⭐
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;