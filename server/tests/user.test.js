import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import User from '../models/user';

const dummyUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'Password123',
  role: 'jobseeker'
};

describe('User Routes', () => {
  let token;

  beforeAll(async () => {
    await User.deleteMany({ email: dummyUser.email });
  });

  afterAll(async () => {
    await User.deleteMany({ email: dummyUser.email });
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(dummyUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.newUser).toHaveProperty('email', dummyUser.email);
  });

  it('should not allow duplicate registration', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(dummyUser);

    expect(res.statusCode).toBe(409);
  });

  it('should login with correct credentials and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: dummyUser.email, password: dummyUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: dummyUser.email, password: 'Wrongpass1' });

    expect(res.statusCode).toBe(401);
  });

  it('should fetch profile when authenticated via token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(dummyUser.email);
  });

  it('should reject profile fetch without token', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.statusCode).toBe(401);
  });
});
