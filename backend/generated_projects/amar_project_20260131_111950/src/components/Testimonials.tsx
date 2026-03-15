import React from 'react';


interface TestimonialsProps {
  testimonials?: string[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = [] }) => {
  return (
    <div className="testimonials">
      <h2>Testimonials</h2>
      <p>Section to display customer testimonials (social proof).</p>
    </div>
  );
};

export default Testimonials;
