import request from 'supertest';
import app from '../server.js';

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4M2FmODdiNmZjNThhOWM0NzZlNjYxNCIsImlhdCI6MTc1MjA3OTA2MCwiZXhwIjoxNzUyMTY1NDYwfQ.-4BFvKebqtj7QS2EjbkQtO1jb84ws0ooyQXvPIlZDVI';
const jobPostId = '686eb88445b48c6ddb44ddfe';
const resumeId = '685bb152c01f0ff957ae5071';
const applicationId = '686ebccc6384651ef902763a';

describe('POST /api/applications/:jobPostId', () => {
    it('should apply to a job with valid token and resumeId', async () => {
      const res = await request(app)
        .post(`/api/applications/${jobPostId}`)
        .set('Authorization', token)
        .send({ resumeId, resumeVersionNumber: 1 });
  
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toMatch(/Successfully applied/);
      expect(res.body.job).toHaveProperty('status', 'Applied');
    });
});

describe('GET /api/applications/applied/all', () => {
    it('should return applied jobs for logged-in jobseeker', async () => {
      const res = await request(app)
        .get('/api/applications/applied/all')
        .set('Authorization', token);
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.jobs)).toBe(true);
    });
});


describe('PATCH /api/applications/withdraw/:jobId', () => {
    it('should withdraw application if status is valid', async () => {
      const res = await request(app)
        .patch(`/api/applications/withdraw/${applicationId}`)
        .set('Authorization', token);
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/Application withdrawn/);
      expect(res.body.job.status).toBe('Withdrawn');
    });
});
  

describe('PATCH /api/applications/saved/:jobPostId', () => {
    it('should unsave a job post', async () => {
      const res = await request(app)
        .patch(`/api/applications/saved/${jobPostId}`)
        .set('Authorization', token)
        .send({ isSaved: false });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Job unsaved');
    });

    it('should save a job post', async () => {
      const res = await request(app)
        .patch(`/api/applications/saved/${jobPostId}`)
        .set('Authorization', token)
        .send({ isSaved: true });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Job saved');
    });
});
  

describe('GET /api/applications/history/:jobId', () => {
    it('should fetch interaction history of application', async () => {
      const res = await request(app)
        .get(`/api/applications/history/${applicationId}`)
        .set('Authorization', token);
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
});  