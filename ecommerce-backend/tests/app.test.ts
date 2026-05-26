import request from 'supertest';
import app from '../src/app.js';

describe('app', () => {
  it('returns health message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('API is running');
  });
});
