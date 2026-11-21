import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // GET /api/health: ¿está viva la API? ¿Qué versión es?
  // El smoke test del despliegue la llama para comprobar la versión nueva.
  @Get('health')
  health() {
    return { status: 'ok', version: process.env.APP_VERSION ?? 'dev' };
  }
}
