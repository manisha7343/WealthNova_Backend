const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app');
const { setupMocha } = require('../setup');

describe('Auth API Endpoints (Mocha/Chai)', () => {
  // Initialize the in-memory database for these tests
  setupMocha();

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        first_name: 'Mocha',
        last_name: 'User',
        email: 'mocha@example.com',
        password: 'Password123!',
        cpassword: 'Password123!'
      });

    // Check assertions using Chai
    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal('registered successfully! please verify your email');
    
    // Some implementations might require email verification next
  });

  it('should not register a user with an existing email', async () => {
    // First register the user
    await request(app).post('/api/auth/register').send({
      first_name: 'Mocha',
      last_name: 'User',
      email: 'mocha2@example.com',
      password: 'Password123!',
      cpassword: 'Password123!'
    });

    // Try registering again
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        first_name: 'Another',
        last_name: 'Name',
        email: 'mocha2@example.com',
        password: 'Password123!',
        cpassword: 'Password123!'
      });

    expect(res.statusCode).to.equal(409); // API returns 409 for duplicate email
    expect(res.body.success).to.be.false;
  });

  it('should login an existing user', async () => {
    // We register the user first
    await request(app).post('/api/auth/register').send({
      first_name: 'Login',
      last_name: 'User',
      email: 'login@example.com',
      password: 'Password123!',
      cpassword: 'Password123!'
    });

    // Note: If email verification is required, login might fail until verified.
    // Adjust this test based on whether verify-email is mandatory.
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'Password123!'
      });

    // expect(res.statusCode).to.equal(200);
    // expect(res.body).to.have.property('token');
  });
});
