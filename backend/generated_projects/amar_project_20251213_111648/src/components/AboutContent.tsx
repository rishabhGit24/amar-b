import React from 'react';

/**
 * @interface AboutContentProps
 * @description Defines the props for the AboutContent component.
 * All props are optional and have default values to ensure the component
 * can be rendered without any explicit props.
 */
interface AboutContentProps {
  /**
   * @property {string} [title] - The main title for the About section.
   * @default 'Our Story & Mission'
   */
  title?: string;
  /**
   * @property {string[]} [storyParagraphs] - An array of strings, each representing a paragraph of the coffee shop's story.
   * @default A default story explaining the shop's origin and passion.
   */
  storyParagraphs?: string[];
  /**
   * @property {string[]} [missionParagraphs] - An array of strings, each representing a paragraph of the coffee shop's mission.
   * @default A default mission statement focusing on quality, experience, and community.
   */
  missionParagraphs?: string[];
  /**
   * @property {string} [imageUrl] - The URL for an image related to the About content.
   * @default 'https://via.placeholder.com/800x400?text=Our+Coffee+Shop+Story' (a placeholder image)
   */
  imageUrl?: string;
  /**
   * @property {string} [imageAlt] - The alt text for the About section image, important for accessibility.
   * @default 'A cozy coffee shop interior with people enjoying coffee'
   */
  imageAlt?: string;
}

/**
 * @function AboutContent
 * @description A functional React component designed to display the story and mission
 * of a coffee shop on an About page. It is built to be production-ready,
 * accessible, and highly configurable with optional props and sensible defaults.
 *
 * @param {AboutContentProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered About content section.
 *
 * @example
 * // Basic usage with default content
 * <AboutContent />
 *
 * @example
 * // Usage with custom content
 * <AboutContent
 *   title="Our Journey"
 *   storyParagraphs={["We started in 2020...", "Our commitment to quality..."]}
 *   missionParagraphs={["To serve the best coffee...", "To foster community..."]}
 *   imageUrl="/images/about-us.jpg"
 *   imageAlt="Our team brewing coffee"
 * />
 */
const AboutContent: React.FC<AboutContentProps> = ({
  title = 'Our Story & Mission',
  storyParagraphs = [
    "Welcome to our coffee shop! We started with a simple dream: to create a cozy space where people could enjoy exceptional coffee and connect with their community. Our journey began many years ago, fueled by a passion for the perfect brew and a desire to share it with others.",
    "From carefully selected beans sourced from sustainable farms around the world to the meticulous art of brewing, every step is taken with dedication. We believe that a great cup of coffee can brighten your day and bring people together, fostering moments of joy and conversation."
  ],
  missionParagraphs = [
    "Our mission is to serve not just coffee, but an experience. We are committed to providing high-quality, ethically sourced coffee, prepared with expertise and served with a smile. We strive to be a welcoming haven for everyone, a place where you can relax, work, or simply enjoy the company of friends and family.",
    "Beyond coffee, we are dedicated to sustainability and community engagement. We actively support local initiatives and aim to minimize our environmental footprint, ensuring that our passion for coffee contributes positively to the world around us."
  ],
  imageUrl = 'https://via.placeholder.com/800x400?text=Our+Coffee+Shop+Story', // A generic placeholder image
  imageAlt = 'A cozy coffee shop interior with people enjoying coffee'
}) => {
  return (
    <section className="about-content" aria-labelledby="about-title">
      <div className="about-header">
        <h2 id="about-title" className="about-title">{title}</h2>
      </div>

      <div className="about-image-container">
        <img src={imageUrl} alt={imageAlt} className="about-image" />
      </div>

      <div className="about-section about-story">
        <h3 className="about-section-title">Our Story</h3>
        {storyParagraphs.map((paragraph, index) => (
          <p key={`story-p-${index}`} className="about-paragraph">{paragraph}</p>
        ))}
      </div>

      <div className="about-section about-mission">
        <h3 className="about-section-title">Our Mission</h3>
        {missionParagraphs.map((paragraph, index) => (
          <p key={`mission-p-${index}`} className="about-paragraph">{paragraph}</p>
        ))}
      </div>
    </section>
  );
};

export default AboutContent;