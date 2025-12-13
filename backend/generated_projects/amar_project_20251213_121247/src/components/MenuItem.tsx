import React from 'react';

interface MenuItemProps {
  name?: string;
  description?: string;
  price?: string;
  imageUrl?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name = 'Delicious Dish',
  description = 'A delightful culinary experience crafted with the freshest ingredients, perfect for any occasion.',
  price = '$0.00',
  imageUrl = 'https://via.placeholder.com/150/cccccc/ffffff?text=Food+Item'
}) => {
  return (
    <article className="menu-item" aria-label={`Menu item: ${name}`}>
      <div className="menu-item__image-container">
        <img
          src={imageUrl}
          alt={`Image of ${name}`}
          className="menu-item__image"
          loading="lazy"
          width="150"
          height="150"
        />
      </div>
      <div className="menu-item__details">
        <h3 className="menu-item__name">{name}</h3>
        <p className="menu-item__description">{description}</p>
        <div className="menu-item__price" aria-label={`Price: ${price}`}>
          {price}
        </div>
      </div>
    </article>
  );
};

export default MenuItem;