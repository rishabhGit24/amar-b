import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Checkbox,
  Stack,
  Paper,
  Container,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// Interface for a single todo item
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

// Interface for TodoList component props
interface TodoListProps {
  todos?: TodoItem[];
  onToggleComplete?: (id: string) => void;
  onDeleteTodo?: (id: string) => void;
  children?: React.ReactNode;
}

// Default sample todos for when no props are provided
const defaultTodos: TodoItem[] = [
  { id: '1', text: 'Plan weekly team meeting agenda', completed: false },
  { id: '2', text: 'Review Q3 performance report', completed: true },
  { id: '3', text: 'Follow up on client feedback', completed: false },
  { id: '4', text: 'Prepare presentation for stakeholder review', completed: false },
  { id: '5', text: 'Schedule 1:1 with new team member', completed: true },
];

const TodoList: React.FC<TodoListProps> = ({
  todos = defaultTodos,
  onToggleComplete = () => {},
  onDeleteTodo = () => {},
  children,
}) => {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '12px',
          backgroundColor: (theme) => theme.palette.background.paper,
          boxShadow: (theme) => `0px 8px 24px rgba(0, 0, 0, 0.15), 0px 2px 8px rgba(0, 0, 0, 0.08)`,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{
              fontWeight: 700,
              color: (theme) => theme.palette.primary.dark,
              mb: 2,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
            }}
          >
            Your Daily Tasks
          </Typography>

          {todos.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                color: (theme) => theme.palette.text.secondary,
                fontStyle: 'italic',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No tasks for today!
              </Typography>
              <Typography variant="body1">
                Time to relax or add a new one to your list.
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {todos.map((todo) => (
                <ListItem
                  key={todo.id}
                  disablePadding
                  sx={{
                    mb: 1,
                    borderRadius: '8px',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                    backgroundColor: todo.completed
                      ? (theme) => theme.palette.action.selected
                      : 'inherit',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    boxShadow: (theme) => `0px 2px 6px rgba(0, 0, 0, 0.05)`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <Checkbox
                      edge="start"
                      checked={todo.completed}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => onToggleComplete(todo.id)}
                      inputProps={{ 'aria-labelledby': `todo-item-${todo.id}` }}
                      sx={{
                        color: todo.completed
                          ? (theme) => theme.palette.success.main
                          : (theme) => theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: (theme) => theme.palette.success.main,
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={`todo-item-${todo.id}`}
                    primary={todo.text}
                    sx={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed
                        ? (theme) => theme.palette.text.disabled
                        : (theme) => theme.palette.text.primary,
                      flexGrow: 1,
                      py: 1,
                    }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete todo"
                    onClick={() => onDeleteTodo(todo.id)}
                    sx={{
                      color: (theme) => theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.error.light + '1A',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
          {children}
        </Stack>
      </Paper>
    </Container>
  );
};

export default TodoList;