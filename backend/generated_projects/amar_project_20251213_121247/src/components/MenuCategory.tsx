import React from 'react';

// Define the interface for a single menu item
interface MenuItem {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

// Define the interface for MenuCategory component props
// ALL props MUST be optional with default values
interface MenuCategoryProps {
  title?: string;
  items?: MenuItem[];
}

// Default menu items to display if no 'items' prop is provided
const defaultMenuItems: MenuItem[] = [
  {
    name: 'Signature Dish',
    description: 'A delightful culinary experience crafted with the freshest ingredients, perfect for any occasion.',
    price: '$19.99',
    imageUrl: 'https://via.placeholder.com/150/cccccc/ffffff?text=Signature+Dish', // Placeholder image
  },
  {
    name: 'Chef\'s Special',
    description: 'Our chef\'s daily creation, featuring seasonal produce and innovative flavors.',
    price: '$24.50',
    imageUrl: 'https://via.placeholder.com/150/cccccc/ffffff?text=Chef\'s+Special', // Placeholder image
  },
  {
    name: 'Classic Favorite',
    description: 'A timeless dish loved by many, prepared with traditional recipes and a touch of modern flair.',
    price: '$15.75',
    imageUrl: 'https://via.placeholder.com/150/cccccc/ffffff?text=Classic+Favorite', // Placeholder image
  },
];

/**
 * MenuCategory component displays a category of menu items.
 * It is designed to be reusable and works without any props, providing default content.
 *
 * @param {MenuCategoryProps} props - The properties for the component.
 * @param {string} [props.title='Our Delicious Menu Category'] - The title of the menu category.
 * @param {MenuItem[]} [props.items=defaultMenuItems] - An array of menu items to display.
 */
const MenuCategory: React.FC<MenuCategoryProps> = ({
  title = 'Our Delicious Menu Category',
  items = defaultMenuItems,
}) => {
  return (
    <section className="menu-category" aria-labelledby="menu-category-title">
      <h2 id="menu-category-title" className="menu-category__title">
        {title}
      </h2>
      <div className="menu-category__items">
        {items.length > 0 ? (
          items.map((item, index) => (
            <article key={item.name + index} className="menu-item">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="menu-item__image"
                loading="lazy" // Optimize image loading for performance
              />
              <div className="menu-item__details">
                <h3 className="menu-item__name">{item.name}</h3>
                <p className="menu-item__description">{item.description}</p>
                <span className="menu-item__price">{item.price}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="menu-category__no-items">No menu items available in this category.</p>
        )}
      </div>
    </section>
  );
};

export default MenuCategory;