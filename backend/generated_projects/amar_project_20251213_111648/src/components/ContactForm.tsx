import React, { useState, useCallback } from 'react';

// Define API response types for clarity and type safety
interface ContactFormSuccessResponse {
  /** A message indicating the success of the submission. */
  message: string;
  /** Optional: A unique ID for the submitted message, if provided by the backend. */
  submissionId?: string;
}

interface ContactFormErrorResponse {
  /** A general error message. */
  error: string;
  /** Optional: More specific details about the error. */
  details?: string;
}

// Define the structure of the data sent to the backend
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Define props interface for the ContactForm component.
// CRITICAL: ALL props are optional with default values.
interface ContactFormProps {
  /**
   * Optional callback function to be executed upon successful form submission.
   * Receives the submitted form data.
   * Defaults to a no-operation function.
   */
  onSubmitSuccess?: (data: ContactFormData) => void;
  /**
   * Optional API endpoint for form submission.
   * Defaults to '/api/contact'.
   */
  apiEndpoint?: string;
  /**
   * Optional success message to display to the user after a successful submission.
   * Defaults to 'Your message has been sent successfully!'.
   */
  successMessageText?: string;
  /**
   * Optional error message to display to the user if the submission fails.
   * Defaults to 'Failed to send message. Please try again later.'.
   */
  errorMessageText?: string;
}

/**
 * ContactForm component for users to send messages or inquiries.
 * Integrates with a backend API endpoint for submission.
 * Provides loading, error, and success states with user feedback.
 *
 * CRITICAL: All props are optional and have default values, allowing usage as <ContactForm />.
 */
const ContactForm: React.FC<ContactFormProps> = ({
  onSubmitSuccess = () => {}, // Default to a no-op function
  apiEndpoint = '/api/contact',
  successMessageText = 'Your message has been sent successfully!',
  errorMessageText = 'Failed to send message. Please try again later.',
}) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handles the form submission logic, including API call and state management.
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset status messages and set loading state
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    const formData: ContactFormData = { name, email, message };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Attempt to parse a more specific error message from the backend response
        let errorData: ContactFormErrorResponse | null = null;
        try {
          errorData = (await response.json()) as ContactFormErrorResponse;
        } catch (jsonError: unknown) {
          // If JSON parsing fails, log the error but proceed with generic message
          console.error('ContactForm: Failed to parse error response JSON:', jsonError);
        }
        // Throw an error with the backend's message or a generic one
        throw new Error(errorData?.error || errorMessageText);
      }

      // Assuming a successful response might also contain JSON data
      const successData: ContactFormSuccessResponse = (await response.json()) as ContactFormSuccessResponse;
      console.log('ContactForm: Submission successful:', successData);

      setSuccessMessage(successMessageText);
      // Clear form fields on successful submission
      setName('');
      setEmail('');
      setMessage('');
      // Invoke the optional onSubmitSuccess callback
      onSubmitSuccess(formData);
    } catch (err: unknown) { // Use 'unknown' for catch block error type in TypeScript 4.9.5
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // Fallback for non-Error objects
        setError(errorMessageText);
      }
      console.error('ContactForm: Submission error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [name, email, message, apiEndpoint, onSubmitSuccess, successMessageText, errorMessageText]);

  return (
    <form onSubmit={handleSubmit} className="contact-form" aria-busy={isLoading}>
      <h2 className="contact-form__title">Send Us a Message</h2>

      {/* Area for displaying loading, error, or success messages */}
      <div aria-live="polite" className="contact-form__status">
        {isLoading && <p className="contact-form__loading">Submitting your message...</p>}
        {error && <p className="contact-form__error" role="alert">{error}</p>}
        {successMessage && <p className="contact-form__success">{successMessage}</p>}
      </div>

      <div className="contact-form__group">
        <label htmlFor="contact-name" className="contact-form__label">Name:</label>
        <input
          type="text"
          id="contact-name"
          className="contact-form__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          aria-required="true"
          disabled={isLoading}
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="contact-email" className="contact-form__label">Email:</label>
        <input
          type="email"
          id="contact-email"
          className="contact-form__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
          aria-required="true"
          disabled={isLoading}
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="contact-message" className="contact-form__label">Message:</label>
        <textarea
          id="contact-message"
          className="contact-form__textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={5}
          required
          aria-required="true"
          disabled={isLoading}
        ></textarea>
      </div>

      <button
        type="submit"
        className="contact-form__button"
        disabled={isLoading}
        aria-label={isLoading ? 'Submitting message' : 'Send message'}
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;