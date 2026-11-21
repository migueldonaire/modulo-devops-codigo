import { NestFactory } from '@nestjs/core';
import { configureApp } from './app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app); // prefijo /api, validación y CORS
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
