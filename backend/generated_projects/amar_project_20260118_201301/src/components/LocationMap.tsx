import React from 'react';


interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

const LocationMap: React.FC<LocationMapProps> = ({ latitude = 0, longitude = 0, zoom = 0 }) => {
  return (
    <div className="locationmap">
      <h2>LocationMap</h2>
      <p>Embeddable map component to show the coffee shop's location.</p>
    </div>
  );
};

export default LocationMap;
