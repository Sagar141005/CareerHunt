import request from 'supertest';
import app from '../server';

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmYyZTYxYzRmNWEwODM1ZmRlOTg1YSIsImlhdCI6MTc1MjA3OTk5MiwiZXhwIjoxNzUyMTY2MzkyfQ.oHr6lWxWU9gIzVSva-8VZeev76clWAXLUiqSRfmPGuI';

const validJobData = {
  company: 'OpenAI',
  companyLogo: 'https://openai.com/logo.png',
  title: 'Frontend Developer',
  description: 'We are looking for a talented frontend developer.',
  location: 'Remote',
  salary: 10000,
  employmentType: 'Full-time',
  type: 'Remote',
  level: 'Mid',
  department: 'IT',
  deadline: '2025-12-31',
  tags: ['React', 'JavaScript']
};

describe('Job Post Routes', () => {

  let createdJobId = '';

  it('should reject request without token', async () => {
    const res = await request(app).post('/api/job-posts/create').send(validJobData);
    expect(res.statusCode).toBe(401);
  });

  it('should create job post with valid token', async () => {
    const res = await request(app)
      .post('/api/job-posts/create')
      .set('Authorization', token)
      .send(validJobData);

    createdJobId = res.body.data.jobPost._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.data.jobPost.title).toBe(validJobData.title);
  });

  it('should fetch job post by ID', async () => {
    const res = await request(app)
      .get(`/api/job-posts/${createdJobId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body.jobPost._id).toBe(createdJobId);
  });

  it('should update job post title', async () => {
    const res = await request(app)
      .put(`/api/job-posts/${createdJobId}`)
      .set('Authorization', token)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.updatedJobPost.title).toBe('Updated Title');
  });

  it('should get all job posts', async () => {
    const res = await request(app)
      .get('/api/job-posts/all')
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.jobPosts)).toBe(true);
  });

  it('should delete job post', async () => {
    const res = await request(app)
      .delete(`/api/job-posts/${createdJobId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
  });

});
