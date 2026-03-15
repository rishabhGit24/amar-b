import React from 'react';


interface CallToActionProps {
  text?: string;
  buttonText?: string;
  link?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ text = '', buttonText = '', link = '' }) => {
  return (
    <div className="calltoaction">
      <h2>CallToAction</h2>
      <p>Prompts users to take a specific action, like ordering or visiting.</p>
    </div>
  );
};

export default CallToAction;
