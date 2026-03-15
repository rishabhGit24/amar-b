import React from 'react';


interface MapEmbedProps {
  address?: string;
  latitude?: number;
  longitude?: number;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ address = '', latitude = 0, longitude = 0 }) => {
  return (
    <div className="mapembed">
      <h2>MapEmbed</h2>
      <p>Embeds a map showing the pizzeria's physical location.</p>
    </div>
  );
};

export default MapEmbed;
