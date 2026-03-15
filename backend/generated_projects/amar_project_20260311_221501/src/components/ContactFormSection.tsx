import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';

// --- Type Definitions ---

/**
 * Configuration for a single form field.
 */
interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

/**
 * Props for the ContactFormSection component.
 */
interface ContactFormSectionProps {
  /**
   * The main heading for the contact form section.
   * @default "Get in Touch"
   */
  heading?: string;
  /**
   * An array of form field configurations. If provided, it overrides the default fields.
   * @default [{ name: 'name', label: 'Your Name', type: 'text', required: true }, ...]
   */
  formFields?: FormFieldConfig[];
}

/**
 * Represents the state of the form data, where keys are field names and values are their string content.
 */
interface FormState {
  [key: string]: string;
}

/**
 * Represents validation errors for form fields, where keys are field names and values are error messages.
 */
interface FormErrors {
  [key: string]: string;
}

/**
 * Represents the expected structure of the API response.
 */
interface ApiResponse {
  success: boolean;
  message: string;
}

// --- Constants ---

/**
 * The API endpoint for submitting contact form data.
 * In a real application, this would likely be an environment variable.
 */
const API_ENDPOINT: string = '/api/contact'; // Mock endpoint

/**
 * Default configuration for the form fields if not provided via props.
 */
const DEFAULT_FORM_FIELDS: FormFieldConfig[] = [
  { name: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'John Doe' },
  { name: 'email', label: 'Your Email', type: 'email', required: true, placeholder: 'john.doe@example.com' },
  { name: 'subject', label: 'Subject', type: 'text', required: false, placeholder: 'Inquiry about a product' },
  { name: 'message', label: 'Your Message', type: 'textarea', required: true, multiline: true, rows: 5, placeholder: 'I would like to know more about...' },
];

/**
 * Initial state for the form data, derived from default fields.
 */
const getInitialFormState = (fields: FormFieldConfig[]): FormState => {
  const initialState: FormState = {};
  fields.forEach(field => {
    initialState[field.name] = '';
  });
  return initialState;
};

// --- Component Definition ---

const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  heading = 'Get in Touch',
  formFields: propFormFields,
}) => {
  const theme = useTheme();
  const fieldsToRender = propFormFields && propFormFields.length > 0 ? propFormFields : DEFAULT_FORM_FIELDS;

  const [formData, setFormData] = useState<FormState>(getInitialFormState(fieldsToRender));
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  /**
   * Handles changes to form input fields, updating the form data state.
   * Clears any existing error for the changed field.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name]; // Clear error when user starts typing
      return newErrors;
    });
    // Reset submit status if user starts typing after a submission attempt
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage(null);
    }
  };

  /**
   * Validates the form data based on the `required` property of each field.
   * Updates `formErrors` state and returns `true` if valid, `false` otherwise.
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    fieldsToRender.forEach(field => {
      const value = formData[field.name];
      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} is required.`;
        isValid = false;
      } else if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field.name] = 'Please enter a valid email address.';
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  /**
   * Handles the form submission process.
   * Performs validation, sends data to the API, and updates UI based on response.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null); // Clear previous messages

    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('Please correct the errors in the form.');
      return;
    }

    setSubmitStatus('loading');
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock API response
      const mockResponse: ApiResponse = {
        success: true,
        message: 'Your message has been sent successfully!',
      };

      // In a real scenario:
      // const response = await fetch(API_ENDPOINT, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   const errorData: ApiResponse = await response.json();
      //   throw new Error(errorData.message || 'Failed to send message.');
      // }

      // const data: ApiResponse = await response.json();
      // if (!data.success) {
      //   throw new Error(data.message || 'Failed to send message.');
      // }

      setSubmitStatus('success');
      setSubmitMessage(mockResponse.message);
      setFormData(getInitialFormState(fieldsToRender)); // Clear form on success

    } catch (error: unknown) {
      setSubmitStatus('error');
      if (error instanceof Error) {
        setSubmitMessage(error.message);
      } else {
        setSubmitMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={8}
        sx={{
          p: { xs: 3, sm: 5, md: 6 },
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: theme.palette.background.paper,
          width: '100%',
          maxWidth: 700,
          boxShadow: `0px 10px 30px rgba(0, 0, 0, 0.1), 0px 4px 10px rgba(0, 0, 0, 0.05)`,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={{ xs: 3, sm: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.dark,
              mb: { xs: 2, sm: 3 },
              letterSpacing: '-0.02em',
            }}
          >
            {heading}
          </Typography>

          <Grid container spacing={3}>
            {fieldsToRender.map(field => (
              <Grid
                item
                xs={12}
                sm={field.name === 'message' || field.name === 'subject' ? 12 : 6}
                key={field.name}
              >
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type === 'textarea' ? 'text' : field.type} // TextField type doesn't support 'textarea'
                  multiline={field.multiline}
                  rows={field.rows}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder}
                  error={!!formErrors[field.name]}
                  helperText={formErrors[field.name]}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: theme.shape.borderRadius,
                      '& fieldset': {
                        borderColor: theme.palette.grey[300],
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.dark,
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: theme.palette.text.secondary,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: theme.palette.primary.dark,
                    },
                  }}
                  aria-label={field.label}
                  aria-required={field.required}
                  aria-invalid={!!formErrors[field.name]}
                  aria-describedby={formErrors[field.name] ? `${field.name}-helper-text` : undefined}
                  inputProps={field.type === 'textarea' ? { 'aria-multiline': true } : undefined}
                />
              </Grid>
            ))}
          </Grid>

          {submitStatus === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <CircularProgress color="primary" size={30} />
            </Box>
          )}

          {submitMessage && (
            <Alert
              severity={submitStatus === 'success' ? 'success' : 'error'}
              sx={{ mt: 3, borderRadius: theme.shape.borderRadius, boxShadow: theme.shadows[1] }}
              aria-live="polite"
            >
              {submitMessage}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={submitStatus === 'loading'}
            sx={{
              mt: 4,
              py: 1.5,
              borderRadius: theme.shape.borderRadius,
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[6],
                backgroundColor: theme.palette.primary.dark,
              },
              '&.Mui-disabled': {
                backgroundColor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            }}
            aria-label="Send Message"
          >
            {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ContactFormSection;