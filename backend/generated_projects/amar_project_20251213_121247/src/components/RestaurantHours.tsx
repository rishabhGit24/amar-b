import React from 'react';

// Define the type for a single hour entry
interface HourEntry {
  day: string;
  time: string;
}

// Define the props interface for RestaurantHours component
// All props must be optional with default values
interface RestaurantHoursProps {
  hours?: HourEntry[]; // hours is an optional array of HourEntry
}

const RestaurantHours: React.FC<RestaurantHoursProps> = ({
  hours = [], // Default value for hours is an empty array
}) => {
  // Check if hours array is empty or not provided
  const hasHours = hours && hours.length > 0;

  return (
    <div className="restaurant-hours" aria-labelledby="restaurant-hours-title">
      <h2 id="restaurant-hours-title" className="restaurant-hours__title">Operating Hours</h2>
      {hasHours ? (
        <dl className="restaurant-hours__list">
          {hours.map((entry, index) => (
            <React.Fragment key={index}>
              <dt className="restaurant-hours__day">{entry.day}</dt>
              <dd className="restaurant-hours__time">{entry.time}</dd>
            </React.Fragment>
          ))}
        </dl>
      ) : (
        <p className="restaurant-hours__unavailable">
          Operating hours are currently unavailable. Please contact us for more information.
        </p>
      )}
    </div>
  );
};

export default RestaurantHours;