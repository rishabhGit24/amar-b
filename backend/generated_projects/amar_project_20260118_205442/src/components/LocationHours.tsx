import React from 'react';


interface LocationHoursProps {
  address?: string;
  hours?: string;
  phone?: string;
}

const LocationHours: React.FC<LocationHoursProps> = ({ address = '', hours = '', phone = '' }) => {
  return (
    <div className="locationhours">
      <h2>LocationHours</h2>
      <p>Component showing the coffee shop's physical address, operating hours, and contact number.</p>
    </div>
  );
};

export default LocationHours;
