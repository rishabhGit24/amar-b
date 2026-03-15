/**
 * Fetches a list of product categories for navigation and display.
 * GET /api/categories
 */
const getCategories = (req, res) => {
  try {
    console.log('GET /api/categories called');
    
    
      // Fetch data
      // In a real application, you would query a database
      const data = { message: 'Data retrieved successfully' };
      
      res.json({
        success: true,
        data
      });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = getCategories;
