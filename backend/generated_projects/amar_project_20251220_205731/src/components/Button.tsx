import React from 'react';


interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: string;
}

const Button: React.FC<ButtonProps> = ({ children = undefined, onClick = undefined, variant = '' }) => {
  return (
    <div className="button">
      <h2>Button</h2>
      <p>A reusable, styled button component for call-to-actions and other interactive elements.</p>
    </div>
  );
};

export default Button;
