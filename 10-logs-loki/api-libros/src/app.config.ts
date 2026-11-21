import { INestApplication, ValidationPipe } from '@nestjs/common';
import { requestLogger } from './common/request-logger';
import { metricsHandler, metricsMiddleware } from './metrics/metrics';

// La configuración de la app, en un solo sitio.
// La usan main.ts y los tests e2e, así se comportan igual.
export function configureApp(app: INestApplication) {
  app.use(requestLogger); // una línea de log por petición (sesión 10)
  app.use(metricsMiddleware); // mide todas las peticiones
  app.use('/metrics', metricsHandler); // GET /metrics para Prometheus (fuera de /api)

  // Todas las rutas empiezan por /api
  app.setGlobalPrefix('api');

  // Comprueba los DTO en todas las rutas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // quita los campos que no estén en el DTO...
      forbidNonWhitelisted: true, // ...y responde 400 si llegan
      transform: true,
    }),
  );

  // CORS: la web que puede llamar a la API depende del entorno
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  });
}
