import React from 'react';

// Define the structure for a single hour entry
interface HourEntry {
  day: string;
  time: string;
}

// Define the props interface for RestaurantHours component
// ALL props MUST be optional
interface RestaurantHoursProps {
  hours?: HourEntry[]; // Array of hour entries, optional
}

// Default hours data to be used when no 'hours' prop is provided
const defaultHours: HourEntry[] = [
  { day: 'Monday', time: '9:00 AM - 9:00 PM' },
  { day: 'Tuesday', time: '9:00 AM - 9:00 PM' },
  { day: 'Wednesday', time: '9:00 AM - 9:00 PM' },
  { day: 'Thursday', time: '9:00 AM - 10:00 PM' },
  { day: 'Friday', time: '9:00 AM - 10:00 PM' },
  { day: 'Saturday', time: '10:00 AM - 11:00 PM' },
  { day: 'Sunday', time: '10:00 AM - 8:00 PM' },
];

// Component definition with default prop values
const RestaurantHours: React.FC<RestaurantHoursProps> = ({
  hours = defaultHours, // Provide default value for hours prop
}) => {
  // Determine if there are any hours to display after defaulting
  const hasHours = hours && hours.length > 0;

  return (
    <div className="restaurant-hours-container" aria-labelledby="restaurant-hours-title">
      <h2 id="restaurant-hours-title" className="restaurant-hours-title">Operating Hours</h2>
      {hasHours ? (
        <dl className="hours-list">
          {hours.map((entry, index) => (
            <div key={index} className="hours-item">
              <dt className="hours-day">{entry.day}</dt>
              <dd className="hours-time">{entry.time}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="no-hours-message">Operating hours are currently unavailable. Please check back later.</p>
      )}
    </div>
  );
};

export default RestaurantHours;