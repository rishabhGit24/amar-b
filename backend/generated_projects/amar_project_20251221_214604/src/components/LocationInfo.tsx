import React from 'react';


interface LocationInfoProps {
  hours?: string[];
  address?: string;
  mapEmbedUrl?: string;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ hours = [], address = '', mapEmbedUrl = '' }) => {
  return (
    <div className="locationinfo">
      <h2>LocationInfo</h2>
      <p>Component to display business hours, address, and an embedded map.</p>
    </div>
  );
};

export default LocationInfo;
