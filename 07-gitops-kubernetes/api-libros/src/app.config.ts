import { INestApplication, ValidationPipe } from '@nestjs/common';

// La configuración de la app, en un solo sitio.
// La usan main.ts y los tests e2e, así se comportan igual.
export function configureApp(app: INestApplication) {
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
