import React from 'react';


interface RestaurantHoursProps {
  hours: Array<{ day: string, time: string }>;
}

const RestaurantHours: React.FC<RestaurantHoursProps> = (props: RestaurantHoursProps) => {
  return (
    <div className="restauranthours">
      <h2>RestaurantHours</h2>
      <p>Shows the restaurant's opening and closing times.</p>
    </div>
  );
};

export default RestaurantHours;
