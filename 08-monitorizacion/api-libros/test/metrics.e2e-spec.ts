import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from '../src/app.config';
import { AppModule } from '../src/app.module';

describe('GET /metrics (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    delete process.env.METRICS_TOKEN;
    await app.close();
  });

  it('cuenta las peticiones por patrón de ruta', async () => {
    await request(app.getHttpServer()).get('/api/books/1');

    const res = await request(app.getHttpServer()).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain(
      'api_http_request_duration_seconds_count{method="GET",route="/api/books/:id",status_code="200"} 1',
    );
    expect(res.text).toContain('api_process_cpu_seconds_total');
  });

  it('pide el token si existe METRICS_TOKEN', async () => {
    process.env.METRICS_TOKEN = 'token-de-prueba';

    const sinToken = await request(app.getHttpServer()).get('/metrics');
    expect(sinToken.status).toBe(401);

    const conToken = await request(app.getHttpServer())
      .get('/metrics')
      .set('Authorization', 'Bearer token-de-prueba');
    expect(conToken.status).toBe(200);
  });
});
