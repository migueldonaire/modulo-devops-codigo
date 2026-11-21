import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from '../src/app.config';
import { AppModule } from '../src/app.module';

// Tests de integración: la API entera, con peticiones HTTP de verdad (supertest)
describe('API de libros (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app); // la misma configuración que main.ts
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/health responde ok', async () => {
    const res = await request(app.getHttpServer()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('GET /api/books devuelve una lista', async () => {
    const res = await request(app.getHttpServer()).get('/api/books');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/books/999 devuelve 404', async () => {
    const res = await request(app.getHttpServer()).get('/api/books/999');
    expect(res.status).toBe(404);
  });

  it('POST /api/books crea un libro válido (201)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/books')
      .send({ title: 'Momo', author: 'Michael Ende', pages: 256 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Momo', pages: 256 });
  });

  it('POST /api/books sin título devuelve 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/books')
      .send({ author: 'Michael Ende', pages: 256 });
    expect(res.status).toBe(400);
  });
});
