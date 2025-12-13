import React from 'react';

// Define the structure for a single menu item
interface MenuItem {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

// Define the structure for a menu category
interface MenuCategory {
  categoryName: string;
  items: MenuItem[];
}

// Define the props for the MenuSection component
// CRITICAL: ALL props MUST be optional (propName?: type)
interface MenuSectionProps {
  menuCategories?: MenuCategory[];
}

// Default menu categories for when no props are provided
const defaultMenuCategories: MenuCategory[] = [
  {
    categoryName: 'Chef\'s Specials',
    items: [
      {
        name: 'Gourmet Truffle Pasta',
        description: 'Handmade pasta with black truffle sauce and parmesan.',
        price: '$24.99',
        imageUrl: 'https://via.placeholder.com/150/8B4513/FFFFFF?text=Truffle+Pasta'
      },
      {
        name: 'Seared Scallops with Risotto',
        description: 'Pan-seared scallops served on creamy saffron risotto.',
        price: '$28.99',
        imageUrl: 'https://via.placeholder.com/150/ADD8E6/000000?text=Scallops'
      }
    ]
  },
  {
    categoryName: 'Classic Dishes',
    items: [
      {
        name: 'Traditional Margherita Pizza',
        description: 'San Marzano tomatoes, fresh mozzarella, basil, and olive oil.',
        price: '$16.00',
        imageUrl: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Margherita+Pizza'
      },
      {
        name: 'Hearty Beef Lasagna',
        description: 'Layers of pasta, rich bolognese, béchamel, and mozzarella.',
        price: '$18.50',
        imageUrl: 'https://via.placeholder.com/150/A52A2A/FFFFFF?text=Lasagna'
      }
    ]
  },
  {
    categoryName: 'Sweet Endings',
    items: [
      {
        name: 'Velvet Chocolate Mousse',
        description: 'Rich, airy chocolate mousse topped with fresh berries.',
        price: '$9.50',
        imageUrl: 'https://via.placeholder.com/150/654321/FFFFFF?text=Chocolate+Mousse'
      }
    ]
  }
];

// Define the functional component with proper typing
// CRITICAL: Use default parameter values for all optional props
const MenuSection: React.FC<MenuSectionProps> = ({
  menuCategories = defaultMenuCategories
}) => {
  // Determine which categories to display. If an empty array is explicitly passed,
  // we still fall back to default content or show an empty message.
  const categoriesToRender = menuCategories.length > 0 ? menuCategories : defaultMenuCategories;

  return (
    <section className="menu-section" aria-labelledby="menu-section-title">
      <h1 id="menu-section-title" className="menu-section__title">Our Menu</h1>

      {categoriesToRender.length === 0 ? (
        <p className="menu-section__empty-message" role="alert">
          No menu categories available at this time. Please check back later!
        </p>
      ) : (
        <div className="menu-section__categories">
          {categoriesToRender.map((category, categoryIndex) => (
            <div key={`category-${categoryIndex}`} className="menu-category">
              <h2 className="menu-category__name">{category.categoryName}</h2>
              <ul className="menu-category__items" aria-label={`${category.categoryName} items`}>
                {category.items.length === 0 ? (
                  <li className="menu-category__empty-item">No items in this category.</li>
                ) : (
                  category.items.map((item, itemIndex) => (
                    <li key={`item-${categoryIndex}-${itemIndex}`} className="menu-item">
                      <img
                        src={item.imageUrl}
                        alt={item.name} // CRITICAL: Meaningful alt text for accessibility
                        className="menu-item__image"
                        loading="lazy" // Improve performance for images
                        width="150" // Provide explicit dimensions for layout stability
                        height="150"
                      />
                      <div className="menu-item__details">
                        <h3 className="menu-item__name">{item.name}</h3>
                        <p className="menu-item__description">{item.description}</p>
                        <span className="menu-item__price" aria-label={`Price: ${item.price}`}>{item.price}</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// Export as default
export default MenuSection;