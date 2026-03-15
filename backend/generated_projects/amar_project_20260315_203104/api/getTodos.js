/**
 * Retrieve all todo items.
 * GET /api/todos
 */
const getTodos = (req, res) => {
  try {
    console.log('GET /api/todos called');
    
    
      // Fetch data
      // In a real application, you would query a database
      const data = { message: 'Data retrieved successfully' };
      
      res.json({
        success: true,
        data
      });
  } catch (error) {
    console.error('Error in getTodos:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = getTodos;
