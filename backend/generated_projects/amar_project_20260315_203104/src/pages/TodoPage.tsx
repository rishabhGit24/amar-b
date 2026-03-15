import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Stack, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ArrowForward, Star, Speed, Security } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TodoInputForm from '../components/TodoInputForm';
import TodoList from '../components/TodoList';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoPageProps {
  children?: React.ReactNode;
}

const API_BASE_URL = 'http://localhost:3001/api/todos';

const TodoPage: React.FC<TodoPageProps> = ({ children = null }) => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error' | 'info' | 'warning'>('info');

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchTodos = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch todos.');
      }
      const data: Todo[] = await response.json();
      setTodos(data);
      showSnackbar('Todos loaded successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
      showSnackbar(`Error loading todos: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = async (title: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: false }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add todo.');
      }
      const newTodo: Todo = await response.json();
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      showSnackbar('Todo added successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
      showSnackbar(`Error adding todo: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateTodoStatus = async (id: string, completed: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update todo.');
      }
      const updatedTodo: Todo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      showSnackbar('Todo updated successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
      showSnackbar(`Error updating todo: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete todo.');
      }
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      showSnackbar('Todo deleted successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
      showSnackbar(`Error deleting todo: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)', // Green gradient for productivity
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h1" sx={{ mb: { xs: 2, md: 3 }, fontWeight: 700, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Master Your Tasks, Achieve Your Goals
          </Typography>
          <Typography variant="h5" sx={{ mb: { xs: 3, md: 4 }, opacity: 0.9, maxWidth: '700px', mx: 'auto', fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
            Organize your life with AMAR's intuitive Todo app. Plan, track, and conquer your daily objectives with ease.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              fontSize: { xs: '1rem', md: '1.1rem' },
              bgcolor: 'primary.dark',
              '&:hover': { bgcolor: 'primary.main' },
              mt: { xs: 2, md: 0 }
            }}
            onClick={() => {
              // Smooth scroll to the todo input section
              const todoInputSection = document.getElementById('todo-input-section');
              if (todoInputSection) {
                todoInputSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Start Organizing Now
          </Button>
        </Container>
      </Box>

      {/* Main Content Section */}
      <Container maxWidth="md" sx={{ flexGrow: 1, py: { xs: 6, md: 8 } }}>
        <Typography variant="h2" align="center" sx={{ mb: { xs: 4, md: 6 }, fontWeight: 600, color: 'primary.main', fontSize: { xs: '2rem', md: '3rem' } }}>
          Your Daily Task Manager
        </Typography>

        <Card sx={{ p: { xs: 2, md: 4 }, mb: { xs: 3, md: 4 }, boxShadow: 3, borderRadius: 2 }} id="todo-input-section">
          <CardContent>
            <Typography variant="h4" sx={{ mb: { xs: 2, md: 3 }, color: 'text.primary', fontSize: { xs: '1.5rem', md: '2rem' } }}>Add a New Todo</Typography>
            <TodoInputForm onAddTodo={addTodo} />
          </CardContent>
        </Card>

        <Card sx={{ p: { xs: 2, md: 4 }, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: { xs: 2, md: 3 }, color: 'text.primary', fontSize: { xs: '1.5rem', md: '2rem' } }}>Your Todos</Typography>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress size={24} sx={{ color: 'primary.main' }} />
                <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>Loading todos...</Typography>
              </Box>
            )}
            {error && (
              <Typography color="error" sx={{ textAlign: 'center', py: 4, fontSize: '1.1rem' }}>
                Error: {error}
              </Typography>
            )}
            {!loading && !error && todos.length === 0 && (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: 'text.secondary', fontSize: '1.1rem' }}>
                No todos yet! Add one above to get started.
              </Typography>
            )}
            {!loading && !error && todos.length > 0 && (
              <TodoList
                todos={todos}
                onUpdateTodoStatus={updateTodoStatus}
                onDeleteTodo={deleteTodo}
              />
            )}
          </CardContent>
        </Card>
      </Container>

      <Footer />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TodoPage;