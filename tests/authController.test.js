const request = require('supertest');
const app = require('../server'); // Express app'inizi import ediyoruz

describe('POST /register', () => {
  it('should return 201 for successful user registration', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
    };

    const response = await request(app).post('/api/auth/register').send(newUser);
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Kullanıcı başarıyla oluşturuldu!');
  });

  it('should return 400 if email already exists', async () => {
    const existingUser = {
      username: 'existingUser',
      email: 'testuser@example.com',
      password: 'testpassword',
    };

    const response = await request(app).post('/api/auth/register').send(existingUser);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('E-posta zaten kullanılıyor.');
  });
});

describe('POST /login', () => {
  it('should return 200 for successful login', async () => {
    const user = {
      email: 'testuser@example.com',
      password: 'testpassword',
    };

    const response = await request(app).post('/api/auth/login').send(user);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Giriş başarılı!');
  });

  it('should return 400 if user not found', async () => {
    const user = {
      email: 'nonexistent@example.com',
      password: 'testpassword',
    };

    const response = await request(app).post('/api/auth/login').send(user);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Kullanıcı bulunamadı.');
  });
});
