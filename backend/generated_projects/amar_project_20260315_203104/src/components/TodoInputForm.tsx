import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TodoInputFormProps {
  onAddTodo?: (todoText: string) => void;
}

interface TodoApiResponse {
  id: string;
  text: string;
  completed: boolean;
}

const API_URL = '/api/todos'; // Placeholder API endpoint

const TodoInputForm: React.FC<TodoInputFormProps> = ({ onAddTodo = () => {} }) => {
  const [todoText, setTodoText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
    if (error) {
      setError(null); // Clear error when user starts typing
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoText.trim()) {
      setError('Todo text cannot be empty.');
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: todoText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add todo item.');
      }

      const newTodo: TodoApiResponse = await response.json();
      onAddTodo(newTodo.text); // Notify parent component
      setTodoText(''); // Clear input field
      setIsSuccess(true);
      setSnackbarOpen(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    // Clear success/error state after snackbar closes
    setIsSuccess(false);
    setError(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.dark', fontWeight: 600 }}>
              Add New Todo Item
            </Typography>

            <TextField
              fullWidth
              label="What needs to be done?"
              variant="outlined"
              value={todoText}
              onChange={handleTextChange}
              disabled={isLoading}
              error={!!error}
              helperText={error ? error : 'Enter a task to add to your list.'}
              aria-label="New todo item text input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'grey.400' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.dark' },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading || !todoText.trim()}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
              sx={{
                mt: 2,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                },
              }}
            >
              {isLoading ? 'Adding Todo...' : 'Add Todo'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={isSuccess ? 'success' : (error ? 'error' : 'info')}
          sx={{ width: '100%' }}
        >
          {isSuccess ? 'Todo item added successfully!' : (error || 'Please enter a todo item.')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TodoInputForm;