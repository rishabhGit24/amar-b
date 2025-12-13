import React from 'react';

// Define the interface for a single dish item
interface Dish {
  name: string;
  description: string;
  imageUrl: string;
}

// Define the interface for the FeaturedDishes component's props
// CRITICAL: ALL props MUST be optional
interface FeaturedDishesProps {
  dishes?: Dish[]; // 'dishes' prop is optional
}

// Define default dishes to be used when no 'dishes' prop is provided
const defaultDishes: Dish[] = [
  {
    name: 'Spicy Arrabiata Penne',
    description: 'Penne pasta with a fiery tomato sauce, garlic, and chili flakes.',
    imageUrl: 'https://via.placeholder.com/400x300/FF5733/FFFFFF?text=Spicy+Penne',
  },
  {
    name: 'Classic Margherita Pizza',
    description: 'A timeless classic with fresh mozzarella, basil, and San Marzano tomato sauce.',
    imageUrl: 'https://via.placeholder.com/400x300/33FF57/FFFFFF?text=Margherita+Pizza',
  },
  {
    name: 'Grilled Salmon with Asparagus',
    description: 'Perfectly grilled Atlantic salmon fillet served with tender roasted asparagus.',
    imageUrl: 'https://via.placeholder.com/400x300/3357FF/FFFFFF?text=Grilled+Salmon',
  },
  {
    name: 'Decadent Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with a scoop of vanilla bean ice cream.',
    imageUrl: 'https://via.placeholder.com/400x300/FF33F7/FFFFFF?text=Lava+Cake',
  },
  {
    name: 'Creamy Mushroom Risotto',
    description: 'Arborio rice cooked to perfection with wild mushrooms, Parmesan, and truffle oil.',
    imageUrl: 'https://via.placeholder.com/400x300/FF8C00/FFFFFF?text=Mushroom+Risotto',
  },
];

// FeaturedDishes functional component
// CRITICAL: Use default parameter values for optional props
const FeaturedDishes: React.FC<FeaturedDishesProps> = ({
  dishes = defaultDishes, // Provide default value for the 'dishes' prop
}) => {
  return (
    <section className="featured-dishes-section" aria-labelledby="featured-dishes-heading">
      <h2 id="featured-dishes-heading" className="featured-dishes-heading">
        Our Signature Dishes
      </h2>
      <div className="featured-dishes-container">
        {dishes.length > 0 ? (
          <ul className="featured-dishes-list">
            {dishes.map((dish, index) => (
              <li key={dish.name + index} className="featured-dish-item">
                <img
                  src={dish.imageUrl}
                  alt={dish.name} // CRITICAL for accessibility: provides text alternative for images
                  className="featured-dish-image"
                  loading="lazy" // Optimize image loading for performance
                />
                <h3 className="featured-dish-name">{dish.name}</h3>
                <p className="featured-dish-description">{dish.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-dishes-message">
            No featured dishes are available at the moment. Please check back later!
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedDishes;