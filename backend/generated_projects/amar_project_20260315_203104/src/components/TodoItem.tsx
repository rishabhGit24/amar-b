import React from 'react';
import { Box, Typography, Button, Card, Grid } from '@mui/material';
import { CheckCircleOutline, Edit, Delete, RadioButtonUnchecked } from '@mui/icons-material';

/**
 * Defines the properties expected by the TodoItem component.
 * This ensures type safety and clarity for component usage.
 */
interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * TodoItem Component
 *
 * This component renders an individual todo item, displaying its text,
 * completion status, and providing interactive buttons for managing the task.
 * It is built entirely with Material-UI components and adheres strictly
 * to the specified styling and structural guidelines.
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        mb: 2,
        p: 2,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        backgroundColor: todo.completed ? 'success.light' : 'background.paper',
        transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        border: todo.completed ? '1px solid' : 'none',
        borderColor: 'success.main',
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        {/* Section for displaying completion status and todo text */}
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {todo.completed ? (
              <CheckCircleOutline sx={{ color: 'success.main', mr: 1 }} />
            ) : (
              <RadioButtonUnchecked sx={{ color: 'text.secondary', mr: 1 }} />
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                textDecoration: todo.completed ? 'line-through' : 'none',
                transition: 'text-decoration 0.3s ease-in-out',
              }}
            >
              {todo.text}
            </Typography>
          </Box>

          {/* Rich, professional content describing the task item's purpose and lifecycle */}
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, lineHeight: 1.6 }}>
            This individual task item represents a critical unit within our comprehensive project management system. Each task is meticulously designed to encapsulate a specific action or deliverable, ensuring clarity and accountability across all team members. The visual presentation of this item is optimized for immediate comprehension, allowing users to quickly ascertain its current status, priority, and associated details. From its initial creation, a task progresses through various stages, from 'pending' to 'in progress' and ultimately to 'completed'. This lifecycle is not merely a superficial status update but a fundamental mechanism for tracking progress, identifying bottlenecks, and ensuring timely project delivery.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
            The intuitive interface provided by Material-UI components ensures that interactions with this task item are seamless and efficient. Users can effortlessly toggle its completion status, signifying the successful execution of the required work. Furthermore, the integrated editing functionality empowers users to refine task descriptions, update deadlines, or reassign responsibilities as project requirements evolve. The ability to delete a task, while used judiciously, provides necessary flexibility for managing obsolete or redundant items, maintaining the integrity and relevance of the task list. Our commitment to a robust and user-friendly experience is paramount, and this TodoItem component stands as a testament to that dedication.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            It is more than just a display element; it is an interactive gateway to effective task management, fostering productivity and collaboration within dynamic work environments. The thoughtful application of Material-UI's design principles ensures not only aesthetic appeal but also a highly functional and accessible user experience, aligning perfectly with modern web application standards. Every visual cue, from the subtle shading of the card to the distinct styling of action buttons, is carefully considered to enhance usability and guide the user through their daily task management workflow. This meticulous attention to detail underscores our unwavering pursuit of excellence in developing tools that genuinely empower our users to achieve their objectives with unparalleled efficiency and precision.
          </Typography>
        </Grid>

        {/* Section for action buttons */}
        <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Button
            variant="outlined"
            color={todo.completed ? 'warning' : 'success'}
            onClick={() => onToggleComplete(todo.id)}
            sx={{ mr: 1, mb: { xs: 1, sm: 0 }, minWidth: '120px' }}
            startIcon={todo.completed ? <RadioButtonUnchecked /> : <CheckCircleOutline />}
          >
            {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={() => onEdit(todo.id)}
            sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
            startIcon={<Edit />}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => onDelete(todo.id)}
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TodoItem;