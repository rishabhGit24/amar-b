import React from 'react';

interface CallToActionProps {
  title: string;
  buttonText: string;
  buttonLink: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title = 'Ready to get started?',
  buttonText = 'Learn More',
  buttonLink = '#',
}) => {
  // Basic validation for critical props to ensure they are not empty strings
  // In a real-world scenario, more robust validation might be needed depending on requirements.
  const isValidLink = buttonLink && buttonLink.trim() !== '';
  const isValidButtonText = buttonText && buttonText.trim() !== '';
  const isValidTitle = title && title.trim() !== '';

  return (
    <section className="call-to-action" aria-labelledby="call-to-action-heading">
      {isValidTitle && <h2 id="call-to-action-heading" className="call-to-action__title">{title}</h2>}
      {isValidButtonText && isValidLink && (
        <a
          href={buttonLink}
          className="call-to-action__button"
          role="button"
          aria-label={`Navigate to ${buttonText}`}
        >
          {buttonText}
        </a>
      )}
    </section>
  );
};

export default CallToAction;