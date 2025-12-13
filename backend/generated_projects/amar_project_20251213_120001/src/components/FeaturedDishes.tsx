import React from 'react';

// Define the interface for a single dish item
interface Dish {
  name: string;
  description: string;
  imageUrl: string;
}

// Define the interface for the component's props
// CRITICAL: ALL props MUST be optional
interface FeaturedDishesProps {
  dishes?: Dish[]; // The array of dishes is optional
}

// Default dishes to display if no 'dishes' prop is provided
const defaultDishes: Dish[] = [
  {
    name: 'Spicy Tuna Roll',
    description: 'Fresh tuna, sriracha, and cucumber, perfectly rolled.',
    imageUrl: 'https://via.placeholder.com/300x200?text=Spicy+Tuna+Roll'
  },
  {
    name: 'Classic Margherita Pizza',
    description: 'San Marzano tomatoes, fresh mozzarella, and basil.',
    imageUrl: 'https://via.placeholder.com/300x200?text=Margherita+Pizza'
  },
  {
    name: 'Grilled Salmon with Asparagus',
    description: 'Perfectly grilled salmon fillet with seasonal asparagus.',
    imageUrl: 'https://via.placeholder.com/300x200?text=Grilled+Salmon'
  },
  {
    name: 'Vegetable Lasagna',
    description: 'Layers of fresh vegetables, rich tomato sauce, and cheese.',
    imageUrl: 'https://via.placeholder.com/300x200?text=Vegetable+Lasagna'
  }
];

/**
 * FeaturedDishes Component
 * A section on the Home page showcasing a selection of the restaurant's signature or popular dishes.
 * All props are optional and have default values, allowing the component to be used as <FeaturedDishes />.
 */
const FeaturedDishes: React.FC<FeaturedDishesProps> = ({
  dishes = defaultDishes // CRITICAL: Provide default value for the optional 'dishes' prop
}) => {
  return (
    <section className="featured-dishes" aria-labelledby="featured-dishes-heading">
      <h2 id="featured-dishes-heading" className="featured-dishes__heading">
        Our Signature Dishes
      </h2>
      <div className="featured-dishes__grid">
        {dishes.length > 0 ? (
          dishes.map((dish, index) => (
            <article key={index} className="featured-dish-card">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="featured-dish-card__image"
                loading="lazy" // Improve performance by lazy loading images
              />
              <div className="featured-dish-card__content">
                <h3 className="featured-dish-card__name">{dish.name}</h3>
                <p className="featured-dish-card__description">{dish.description}</p>
              </div>
            </article>
          ))
        ) : (
          <p className="featured-dishes__no-content">
            No featured dishes available at the moment. Please check back later!
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedDishes;