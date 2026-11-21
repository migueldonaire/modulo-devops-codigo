import { NextFunction, Request, Response } from 'express';
import { collectDefaultMetrics, Histogram, register } from 'prom-client';

// Métricas para Prometheus y Grafana (sesión 08)

// CPU, memoria, event loop... del proceso de Node.js (empiezan por "api_")
collectDefaultMetrics({ prefix: 'api_' });

// Cuánto tarda cada petición, por método, ruta y código de respuesta.
// Un histograma también cuenta las peticiones: api_http_request_duration_seconds_count
const httpRequestDuration = new Histogram({
  name: 'api_http_request_duration_seconds',
  help: 'Duration of the HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 3],
});

// Middleware: mide cada petición (menos /metrics)
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path === '/metrics') return next();
  const stopTimer = httpRequestDuration.startTimer();

  res.on('finish', () => {
    // El patrón de la ruta (/api/books/:id), no la URL real (/api/books/7):
    // así hay una serie por ruta, no una por libro
    const route = (req.route as { path?: string } | undefined)?.path;
    stopTimer({
      method: req.method,
      route: route ?? 'unknown',
      status_code: String(res.statusCode),
    });
  });

  next();
}

// GET /metrics: el texto que lee Prometheus.
// Con METRICS_TOKEN, pide "Authorization: Bearer <token>".
// Sin METRICS_TOKEN: abierto en tu ordenador y oculto (404) en producción.
export async function metricsHandler(req: Request, res: Response) {
  const token = process.env.METRICS_TOKEN;
  if (!token && process.env.NODE_ENV === 'production') {
    res.status(404).end();
    return;
  }
  if (token && req.headers.authorization !== `Bearer ${token}`) {
    res.status(401).end();
    return;
  }
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}
