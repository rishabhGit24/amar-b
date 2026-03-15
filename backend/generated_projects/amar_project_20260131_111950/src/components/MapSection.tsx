import React from 'react';


interface MapSectionProps {
  address?: string;
  coordinates?: object;
}

const MapSection: React.FC<MapSectionProps> = ({ address = '', coordinates = {} }) => {
  return (
    <div className="mapsection">
      <h2>MapSection</h2>
      <p>Displays a map with the cafe's location and address.</p>
    </div>
  );
};

export default MapSection;
