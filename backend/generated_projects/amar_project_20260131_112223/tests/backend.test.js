/**
 * Backend API Tests
 * Tests all API endpoints for proper functionality
 */
const request = require('supertest');
const app = require('../server');

describe('Backend API Endpoints', () => {
  test('GET /health - health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.status).toBe('ok');
  });

  test('GET /api/products/featured - success', async () => {
    const response = await request(app)
      .get('/api/products/featured')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });

  test('GET /api/categories - success', async () => {
    const response = await request(app)
      .get('/api/categories')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
  
  test('404 - endpoint not found', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect('Content-Type', /json/)
      .expect(404);
    
    expect(response.body.success).toBe(false);
  });
});
