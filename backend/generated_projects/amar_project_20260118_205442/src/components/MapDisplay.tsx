import React from 'react';


interface MapDisplayProps {
  latitude?: number;
  longitude?: number;
  zoomLevel?: number;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ latitude = 0, longitude = 0, zoomLevel = 0 }) => {
  return (
    <div className="mapdisplay">
      <h2>MapDisplay</h2>
      <p>An embedded map component showing the coffee shop's location.</p>
    </div>
  );
};

export default MapDisplay;
