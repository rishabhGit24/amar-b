import React from 'react';


interface OpeningHoursProps {
  title: string;
  hours: string;
}

const OpeningHours: React.FC<OpeningHoursProps> = (props: OpeningHoursProps) => {
  return (
    <div className="openinghours">
      <h2>OpeningHours</h2>
      <p>Clearly displays the 24/7 opening hours.</p>
    </div>
  );
};

export default OpeningHours;
