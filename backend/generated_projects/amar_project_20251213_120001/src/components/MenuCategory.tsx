import React from 'react';

// Define the interface for a single menu item
interface MenuItem {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

// Define the interface for MenuCategory props, making all optional
interface MenuCategoryProps {
  title?: string;
  items?: MenuItem[]; // Array of MenuItem objects
}

const MenuCategory: React.FC<MenuCategoryProps> = ({
  title = 'Untitled Category', // Default title
  items = [] // Default to an empty array if no items are provided
}) => {
  // Generate a simple, unique ID for accessibility purposes based on the title.
  // This helps screen readers associate the list with its heading.
  // Using a simple replace for spaces and converting to lowercase for a valid ID.
  const categoryId = `menu-category-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <section className="menu-category" aria-labelledby={categoryId}>
      <h2 className="menu-category-title" id={categoryId}>
        {title}
      </h2>
      {items.length > 0 ? (
        <ul className="menu-category-list">
          {items.map((item, index) => (
            // Using item.name + index as a key for uniqueness,
            // assuming item.name might not be globally unique across all items,
            // but unique within the context of its original position in the array.
            <li key={`${item.name}-${index}`} className="menu-category-item">
              {/* Render image only if imageUrl is provided and not an empty string */}
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name} // Alt text is crucial for accessibility
                  className="menu-category-item-image"
                />
              )}
              <div className="menu-category-item-details">
                <h3 className="menu-category-item-name">{item.name}</h3>
                {/* Render description only if it's provided and not an empty string */}
                {item.description && (
                  <p className="menu-category-item-description">{item.description}</p>
                )}
                {/* Render price only if it's provided and not an empty string */}
                {item.price && (
                  <p className="menu-category-item-price" aria-label={`Price: ${item.price}`}>
                    {item.price}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="menu-category-empty-message">No items available in this category.</p>
      )}
    </section>
  );
};

export default MenuCategory;