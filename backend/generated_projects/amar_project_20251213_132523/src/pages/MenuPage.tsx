import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuCategory from '../components/MenuCategory';
import MenuItem from '../components/MenuItem';

// Assuming these interfaces for MenuCategory and MenuItem based on the description
// In a real project, these would be imported from the component's definition file.
interface MenuItemProps {
  name: string;
  description: string;
  price: string;
  // Add an optional image prop for richer display if MenuItem supports it
  image?: string;
}

interface MenuCategoryProps {
  title: string;
  items: MenuItemProps[];
}

const menuData: MenuCategoryProps[] = [
  {
    title: "Appetizers 🍽️",
    items: [
      {
        name: "Crispy Spring Rolls",
        description: "Golden-fried rolls filled with fresh vegetables and glass noodles, served with sweet chili dipping sauce.",
        price: "$8.99",
        image: "https://images.unsplash.com/photo-1512058564833-bb605b78807d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xsc3xlbnwwfHx8fDE2NzY1NDU2NzU&ixlib=rb-4.0.3&q=80&w=400"
      },
      {
        name: "Garlic Parmesan Knots",
        description: "Warm, soft dough knots brushed with rich garlic butter and sprinkled with aged Parmesan cheese, served with marinara.",
        price: "$7.50",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxnYXJsaWMlMjBrbm90c3xlbnwwfHx8fDE2NzY1NDU3MjU&ixlib=rb-4.0.3&q=80&w=400"
      },
      {
        name: "Spicy Edamame",
        description: "Steamed edamame pods tossed in a fiery chili-garlic sauce, a perfect kick-starter.",
        price: "$6.00",
        image: "https://images.unsplash.com/photo-1593560704721-db1b67a7a7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxlZGFtYW1lfGVufDB8fHx8MTY3NjU0NTc3NQ&ixlib=rb-4.0.3&q=80&w=400"
      }
    ]
  },
  {
    title: "Main Courses 🍝",
    items: [
      {
        name: "Classic Margherita Pizza",
        description: "Our signature thin-crust pizza with San Marzano tomato sauce, fresh mozzarella, and basil.",
        price: "$16.99",
        image: "https://images.unsplash.com/photo-1593560704721-db1b67a7a7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MHx8fHwxNjc2NTQ1ODQ1&ixlib=rb-4.0.3&q=80&w=400"
      },
      {
        name: "Grilled Salmon with Asparagus",
        description: "Perfectly grilled Atlantic salmon fillet, served with roasted asparagus and a lemon-dill sauce.",
        price: "$24.50",
        image: "https://images.unsplash.com/photo-1519708227418-a3679df6297f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9ufGVufDB8fHx8MTY3NjU0NTg5NQ&ixlib=rb-4.0.3&q=80&w=400"
      },
      {
        name: "Spicy Chicken Alfredo",
        description: "Fettuccine pasta tossed in a creamy Alfredo sauce with grilled chicken, sun-dried tomatoes, and a hint of chili.",
        price: "$19.75",
        image: "https://images.unsplash.com/photo-1585238342072-230232147171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxhbGZyZWRvJTIwcGFzdGF8ZW58MHx8fHwxNjc2NTQ1OTQ1&ixlib=rb-4.0.3&q=80&w=400"
      },
      {
        name: "Vegan Buddha Bowl",
        description: "A vibrant bowl packed with quinoa, roasted sweet potatoes, avocado, chickpeas, and a tahini dressing.",
        price: "$18.00",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxiaXJkcyUyMGJvd2x8ZW58MHx8fHwxNjc2NTQ2MDA1&ixlib=rb-4.0.3&q=80&w=400"
      }
    ]
  },
  {
    title: "Desserts 🍰",
    items: [
      {
        name: "New York Cheesecake",
        description: "Rich and creamy cheesecake on a graham cracker crust, served with berry compote.",
        price: "$9.50",
        image: "https://images.unsplash.com/photo-1567620905762-edb432298458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxjcmVhbWNoZWVzZWNhcnxlbnwwfHx8fDE2NzY1NDYwNjU&ixlib=rb-4.0.3&q=80&w=400"
      },
      {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center, served with vanilla bean ice cream.",
        price: "$10.00",
        image: "https://images.unsplash.com/photo-1551026990-089e162c9f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxsYXZhJTIwY2FrZXxlbnwwfHx8fDE2NzY1NDYxMTU&ixlib=rb-4.0.3&q=80&w=400"
      },
      {
        name: "Seasonal Fruit Tart",
        description: "A delicate pastry crust filled with vanilla pastry cream and topped with fresh seasonal fruits.",
        price: "$8.75",
        image: "https://images.unsplash.com/photo-1587314168485-32f27334e739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxmcnVpdCUyMHRhcnR8ZW58MHx8fHwxNjc2NTQ2MTY1&ixlib=rb-4.0.3&q=80&w=400"
      }
    ]
  },
  {
    title: "Beverages ☕",
    items: [
      {
        name: "Freshly Brewed Coffee",
        description: "Aromatic blend of premium coffee beans, brewed to perfection.",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTY3NjU0NjIxNQ&ixlib=rb-4.0.3&q=80&w=400"
      },
      {
        name: "Artisanal Iced Tea",
        description: "Refreshing blend of black tea, infused with natural fruit essences, served over ice.",
        price: "$4.00",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxpY2VkJTIwdGVhfGVufDB8fHx8MTY3NjU0NjI2NQ&ixlib=rb-4.0.3&q=80&w=400"
      },
      {
        name: "Sparkling Lemonade",
        description: "Zesty lemonade with a delightful fizz, a perfect thirst quencher.",
        price: "$5.00",
        image: "https://images.unsplash.com/photo-1523371054106-4f4f0c62952c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjVlMjF8MHwxfHNlYXJjaHwxfHxsZW1vbmFkZXxlbnwwfHx8fDE2NzY1NDYzMTU&ixlib=rb-4.0.3&q=80&w=400"
      }
    ]
  }
];

const MenuPage: React.FC = () => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
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
          Discover a culinary journey with our carefully crafted dishes, from delightful appetizers to decadent desserts.
          Every bite is an experience.
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)', // Slightly different gradient for CTA
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
          marginTop: '40px'
        }}>
          View Specials Today
        </button>
      </div>

      {/* Menu Categories Section */}
      {menuData.map((category, index) => (
        <section
          key={category.title}
          style={{
            padding: '80px 20px',
            maxWidth: '1200px',
            margin: '0 auto',
            background: index % 2 === 0 ? '#ffffff' : '#f0f2f5', // Alternate background for visual separation
            borderRadius: '15px',
            marginBottom: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}
        >
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center' as const,
            marginBottom: '60px',
            color: '#2d3748',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
          }}>
            {category.title}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            {/* MenuCategory component is a container for items, so we pass the title and items */}
            {/* Assuming MenuCategory internally renders its title and then iterates over its items */}
            <MenuCategory title={category.title} items={category.items.map(item => (
              // MenuItem is an individual item. We wrap it in a styled div for card-like appearance.
              // Assuming MenuItem itself renders the name, description, price.
              <div key={item.name} style={{
                background: 'white',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column' as const,
                justifyContent: 'space-between' as const,
                overflow: 'hidden'
              }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover' as const,
                      borderRadius: '10px',
                      marginBottom: '20px'
                    }}
                  />
                )}
                <h3 style={{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '10px', fontWeight: '600' }}>
                  {item.name}
                </h3>
                <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.6', flexGrow: 1 }}>
                  {item.description}
                </p>
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#667eea', marginTop: '15px' }}>
                  {item.price}
                </p>
                <button style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '12px 25px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  marginTop: '20px',
                  alignSelf: 'flex-start' as const
                }}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div >
        </section>
      ))}

      {/* Call to Action Section */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #f7f9fc 0%, #e0e8f0 100%)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        marginBottom: '60px'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          color: '#2d3748',
          marginBottom: '20px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
        }}>
          Ready to Order? 🚀
        </h2>
        <p style={{
          fontSize: '1.3rem',
          color: '#4a5568',
          maxWidth: '800px',
          margin: '0 auto 40px auto',
          lineHeight: '1.7'
        }}>
          Experience the convenience of online ordering and have your favorite dishes delivered right to your door.
          Fresh ingredients, exceptional taste, every time.
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
          Order Online Now
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;