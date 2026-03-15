import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Grid,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';

/**
 * @typedef {Object} ContactFormField
 * @property {string} name - The unique name for the form field (used as key in form data).
 * @property {string} label - The visible label for the form field.
 * @property {string} [type='text'] - The HTML input type (e.g., 'text', 'email', 'tel').
 * @property {boolean} [multiline=false] - If true, the field will be a textarea.
 * @property {number} [rows=4] - Number of rows for multiline text fields.
 * @property {boolean} [required=false] - If true, the field is required.
 */
interface ContactFormField {
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}

/**
 * @typedef {Object} ContactFormSectionProps
 * @property {ContactFormField[]} [formFields] - An array defining the form fields.
 * @property {string} [submitUrl] - The URL endpoint to submit the form data to.
 */
interface ContactFormSectionProps {
  formFields?: ContactFormField[];
  submitUrl?: string;
}

/**
 * @typedef {Object} FormDataState
 * @property {string} [key: string] - Dynamic keys for form data.
 */
type FormDataState = Record<string, string>;

/**
 * @typedef {Object} ApiResponse
 * @property {string} message - A message from the API.
 * @property {boolean} success - Indicates if the API call was successful.
 */
interface ApiResponse {
  message: string;
  success: boolean;
}

const DEFAULT_SUBMIT_URL: string = '/api/contact';

const DEFAULT_FORM_FIELDS: ContactFormField[] = [
  { name: 'name', label: 'Your Name', type: 'text', required: true },
  { name: 'email', label: 'Your Email', type: 'email', required: true },
  { name: 'subject', label: 'Subject', type: 'text' },
  { name: 'message', label: 'Your Message', multiline: true, rows: 5, required: true },
];

/**
 * ContactFormSection component provides a visually polished and functional form
 * for customers to send inquiries or feedback. It supports custom form fields,
 * handles submission states (loading, success, error), and is fully responsive.
 *
 * @param {ContactFormSectionProps} props - The props for the component.
 * @returns {JSX.Element} The ContactFormSection component.
 */
const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  formFields = DEFAULT_FORM_FIELDS,
  submitUrl = DEFAULT_SUBMIT_URL,
}) => {
  const theme = useTheme();

  const initialFormData: FormDataState = formFields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {} as FormDataState);

  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset feedback states when user starts typing again
    setIsSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        throw new Error(errorData.message || 'Failed to submit form. Please try again.');
      }

      const successData: ApiResponse = await response.json();
      setIsSuccess(true);
      setFormData(initialFormData); // Clear form on success
      console.log('Form submitted successfully:', successData.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      console.error('Form submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 6, md: 10 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 5, md: 6 },
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: theme.palette.background.paper,
          width: '100%',
          maxWidth: '800px',
          boxShadow: `0px 10px 30px rgba(0, 0, 0, 0.1), 0px 4px 10px rgba(0, 0, 0, 0.05)`,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={4} alignItems="center">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: 'center',
              mb: 1,
              [theme.breakpoints.down('sm')]: {
                fontSize: '2rem',
              },
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              maxWidth: '600px',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.
          </Typography>

          {isSuccess && (
            <Alert
              severity="success"
              sx={{ width: '100%', mb: 2 }}
              aria-live="polite"
            >
              Thank you for your message! We have received it and will respond shortly.
            </Alert>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{ width: '100%', mb: 2 }}
              aria-live="assertive"
            >
              Error: {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%' }}
            noValidate
            aria-label="Contact Us Form"
          >
            <Grid container spacing={3}>
              {formFields.map((field) => (
                <Grid
                  item
                  xs={12}
                  sm={field.multiline ? 12 : 6}
                  key={field.name}
                >
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type || 'text'}
                    multiline={field.multiline || false}
                    rows={field.rows || 1}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required || false}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: theme.shape.borderRadius,
                        '& fieldset': {
                          borderColor: theme.palette.divider,
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.light,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.text.secondary,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: theme.palette.primary.main,
                      },
                    }}
                    aria-label={field.label}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: `0px 4px 15px ${theme.palette.primary.dark}30`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      boxShadow: `0px 6px 20px ${theme.palette.primary.dark}40`,
                    },
                    '&.Mui-disabled': {
                      backgroundColor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                    },
                  }}
                  aria-label="Submit Contact Form"
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ContactFormSection;