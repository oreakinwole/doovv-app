import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@doovo.com', password: 'password123' })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    authToken = response.body.access_token;
  });

  it('/bookings (POST)', async () => {
    const bookingData = {
      serviceType: 'DROP_OFF',
      vehicleInfo: '2024 Honda Civic',
      scheduledAt: '2024-12-25T10:00:00Z',
    };

    return request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bookingData)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});