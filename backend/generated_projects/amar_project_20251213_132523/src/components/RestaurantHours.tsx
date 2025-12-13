import React from 'react';


interface RestaurantHoursProps {
  hours?: Array<{day: string, time: string}>;
}

const RestaurantHours: React.FC<RestaurantHoursProps> = ({ hours = '' }) => {
  return (
    <div className="restauranthours">
      <h2>RestaurantHours</h2>
      <p>Displays the restaurant's operating hours for each day of the week.</p>
    </div>
  );
};

export default RestaurantHours;
