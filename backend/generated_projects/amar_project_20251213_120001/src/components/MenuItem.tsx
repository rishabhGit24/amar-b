import React from 'react';

interface MenuItemProps {
  name?: string;
  description?: string;
  price?: string;
  imageUrl?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name = 'Signature Dish',
  description = 'A delightful culinary creation crafted with the freshest seasonal ingredients, offering a unique blend of flavors and textures.',
  price = '$19.99',
  imageUrl = 'https://via.placeholder.com/150x150?text=Food+Item',
}) => {
  return (
    <article className="menu-item" aria-labelledby="menu-item-name" aria-describedby="menu-item-description">
      <div className="menu-item__image-container">
        <img
          src={imageUrl}
          alt={`Image of ${name}`}
          className="menu-item__image"
          loading="lazy"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            // Fallback to a generic placeholder if the image fails to load
            e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Image+Error';
            e.currentTarget.alt = 'Image failed to load, showing placeholder';
          }}
        />
      </div>
      <div className="menu-item__details">
        <h3 id="menu-item-name" className="menu-item__name">{name}</h3>
        <p id="menu-item-description" className="menu-item__description">{description}</p>
        <div className="menu-item__price" aria-label={`Price: ${price}`}>{price}</div>
      </div>
    </article>
  );
};

export default MenuItem;