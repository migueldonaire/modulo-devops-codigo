import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const logger = new Logger('HTTP');

// Middleware: una línea de log por petición, con su código y lo que ha tardado.
// Nunca apuntamos el body ni las cabeceras: pueden llevar contraseñas o tokens.
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  if (req.path === '/metrics') {
    next(); // Prometheus la llama cada 15 s: no llenamos el log con eso
    return;
  }
  const start = Date.now();

  // 'finish' salta cuando la respuesta ya se ha enviado
  res.on('finish', () => {
    const ms = Date.now() - start;
    logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });

  next();
}
