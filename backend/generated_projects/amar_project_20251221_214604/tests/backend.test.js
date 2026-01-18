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

  test('POST /api/contact - success', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'test@example.com', message: 'Test message' })
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
  
  test('POST /api/contact - validation error', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400);
    
    expect(response.body.success).toBe(false);
  });
  
  test('404 - endpoint not found', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect('Content-Type', /json/)
      .expect(404);
    
    expect(response.body.success).toBe(false);
  });
});
