import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';

// --- Constants ---
const DEFAULT_SUBMIT_ENDPOINT: string = 'https://api.example.com/contact'; // Placeholder API endpoint
const API_SUBMISSION_DELAY_MS: number = 1500; // Simulate network delay for better UX

// --- Types ---
interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'password';
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

interface ContactFormSectionProps {
  formFields?: FormField[];
  submitEndpoint?: string;
}

interface FormData {
  [key: string]: string;
}

interface ApiResponse {
  message: string;
}

// --- Default Form Fields ---
const DEFAULT_FORM_FIELDS: FormField[] = [
  { name: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'John Doe' },
  { name: 'email', label: 'Your Email', type: 'email', required: true, placeholder: 'john.doe@example.com' },
  { name: 'subject', label: 'Subject', type: 'text', required: true, placeholder: 'Inquiry about coffee beans' },
  { name: 'message', label: 'Your Message', type: 'text', required: true, multiline: true, rows: 5, placeholder: 'Tell us more about your inquiry...' },
];

// --- Component ---
const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  formFields = DEFAULT_FORM_FIELDS,
  submitEndpoint = DEFAULT_SUBMIT_ENDPOINT,
}) => {
  const initialFormData: FormData = formFields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {} as FormData);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    formFields.forEach((field) => {
      if (field.required && !formData[field.name].trim()) {
        errors[field.name] = `${field.label} is required.`;
        isValid = false;
      } else if (field.type === 'email' && formData[field.name] && !/\S+@\S+\.\S+/.test(formData[field.name])) {
        errors[field.name] = 'Please enter a valid email address.';
        isValid = false;
      }
      // Additional validation rules can be added here (e.g., phone number format, min/max length)
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate network request delay for better UX
      await new Promise((resolve) => setTimeout(resolve, API_SUBMISSION_DELAY_MS));

      // In a real application, you would send formData to your backend:
      /*
      const response = await fetch(submitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form.');
      }

      const data: ApiResponse = await response.json();
      console.log('Form submitted successfully:', data);
      */

      // For demonstration, simulate a successful response
      const simulatedResponse: ApiResponse = { message: 'Your inquiry has been sent successfully!' };
      console.log('Simulated form submission:', formData);
      console.log('Simulated API response:', simulatedResponse);

      setIsSuccess(true);
      setFormData(initialFormData); // Clear form on success
      setFormErrors({}); // Clear any lingering errors
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred during submission.');
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper
        elevation={8}
        sx={{
          p: { xs: 4, sm: 6, md: 8 },
          borderRadius: 3,
          backgroundColor: 'background.paper',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={{ xs: 3, md: 5 }} component="form" onSubmit={handleSubmit} aria-label="Contact Us Form">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.dark',
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
              }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              Have a question, feedback, or just want to say hello? Fill out the form below, and we will get back to you as soon as possible.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {formFields.map((field) => (
              <Grid item xs={12} sm={field.multiline ? 12 : 6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  multiline={field.multiline}
                  rows={field.rows}
                  placeholder={field.placeholder}
                  error={!!formErrors[field.name]}
                  helperText={formErrors[field.name]}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'grey.300',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.dark',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'primary.dark',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {isSuccess && (
            <Alert severity="success" sx={{ borderRadius: 2, py: 1.5 }}>
              Your message has been sent successfully! We appreciate you reaching out.
            </Alert>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ borderRadius: 2, py: 1.5 }}>
              {errorMessage} Please try again later.
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Message'
            )}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ContactFormSection;