/**
 * Add a new todo item.
 * POST /api/todos
 */
const addTodo = (req, res) => {
  try {
    console.log('POST /api/todos called');
    
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }
    
      // Process the request
      console.log('Processing request:', req.body);
      
      res.json({
        success: true,
        message: 'Request processed successfully',
        data: req.body
      });
  } catch (error) {
    console.error('Error in addTodo:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = addTodo;
