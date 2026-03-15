import React from 'react';


interface GallerySectionProps {
  images?: string[];<string>;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images = '' }) => {
  return (
    <div className="gallerysection">
      <h2>GallerySection</h2>
      <p>A visual gallery showcasing high-quality photographs of the cafe's interior, exterior, delicious food, and beverages to entice visitors.</p>
    </div>
  );
};

export default GallerySection;
